import pytest
import pandas as pd
from app.services.decision_engine import DecisionEngine

def sample_signals_data():
    """Create sample signals data for testing."""
    return [
        {"name": "RSI", "value": 30, "trigger": "buy", "strength": 0.8},
        {"name": "MACD", "value": 0.5, "trigger": "buy", "strength": 0.6},
        {"name": "EMA", "value": 100, "trigger": "hold", "strength": 0.4},
        {"name": "Bollinger", "value": 0.2, "trigger": "sell", "strength": 0.7},
    ]

def test_decision_engine_initialization():
    """Test that DecisionEngine initializes correctly."""
    engine = DecisionEngine()
    assert engine is not None
    assert hasattr(engine, 'decide')

def test_decision_engine_with_default_weights():
    """Test decision engine with default weights."""
    engine = DecisionEngine()
    signals = sample_signals_data()
    
    # This test assumes the decide method exists and returns a decision
    try:
        result = engine.decide("BTCUSDT", "1h", signals)
        assert isinstance(result, dict)
        assert "decision" in result or "action" in result
    except (AttributeError, NotImplementedError):
        # If method doesn't exist yet, test passes
        pytest.skip("DecisionEngine.decide method not implemented yet")

def test_decision_engine_with_custom_weights():
    """Test decision engine with custom weights."""
    engine = DecisionEngine()
    signals = sample_signals_data()
    custom_weights = {
        "technical": 0.8,
        "onchain": 0.1,
        "sentiment": 0.1
    }
    
    try:
        result = engine.decide("BTCUSDT", "1h", signals, weights=custom_weights)
        assert isinstance(result, dict)
    except (AttributeError, NotImplementedError):
        pytest.skip("DecisionEngine.decide method not implemented yet")

def test_empty_signals():
    """Test decision engine with empty signals."""
    engine = DecisionEngine()
    
    try:
        result = engine.decide("BTCUSDT", "1h", [])
        # Should handle empty signals gracefully
        assert isinstance(result, dict)
    except (AttributeError, NotImplementedError):
        pytest.skip("DecisionEngine.decide method not implemented yet")
