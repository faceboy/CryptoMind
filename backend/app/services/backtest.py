from app.services.signal_engine import get_dataframe, _load_class, SIGNAL_IMPLS

def backtest(db, symbol: str, timeframe: str, configs, initial_cash=10000.0, fee_bps=10.0):
    df = get_dataframe(db, symbol, timeframe)
    if df.empty:
        raise ValueError("No data to backtest")
    full = df.copy()
    sets = []
    for cfg in configs:
        impl = _load_class(SIGNAL_IMPLS[cfg["name"]])
        out = impl.compute(df.copy(), **(cfg.get("params") or {}))
        out = out[["ts","trigger"]].rename(columns={"trigger": f"t_{cfg['name']}"})
        sets.append(out)
    for t in sets:
        full = full.merge(t, on="ts", how="left")
    trig_cols = [c for c in full.columns if c.startswith("t_")]
    for c in trig_cols:
        full[c] = full[c].fillna(0)
    full["agg"] = full[trig_cols].sum(axis=1)
    full["pos"] = (full["agg"] > 0).astype(int)
    full["pos_prev"] = full["pos"].shift(1).fillna(0)
    full["trade"] = full["pos"] - full["pos_prev"]
    cash = initial_cash; coin = 0.0; fee = fee_bps/10000.0
    for _, row in full.iterrows():
        price = row["close"]
        if row["trade"] == 1:
            amt = cash * (1 - fee) / price; coin += amt; cash = 0.0
        elif row["trade"] == -1 and coin > 0:
            proceeds = coin * price * (1 - fee); cash += proceeds; coin = 0.0
    equity = cash + coin * full.iloc[-1]["close"]
    ret = (equity / initial_cash) - 1.0
    return {"final_equity": equity, "return": ret, "trades": int(full["trade"].abs().sum())}
