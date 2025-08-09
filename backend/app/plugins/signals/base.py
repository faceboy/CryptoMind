import abc
import pandas as pd

class BaseSignal(abc.ABC):
    name: str = "base"

    @abc.abstractmethod
    def compute(self, df: pd.DataFrame, **params) -> pd.DataFrame:
        """Return df with a 'value' column and an optional 'trigger' in {-1,0,1}"""
        raise NotImplementedError
