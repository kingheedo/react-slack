import React, { ChangeEvent, useCallback, useState } from 'react';

const customInput = <T = any>(
  value: T,
): [T, React.Dispatch<React.SetStateAction<T>>, (e: ChangeEvent<HTMLInputElement>) => void] => {
  const [input, setInput] = useState(value);
  const onChangeInput = useCallback((e) => {
    setInput(e.target.value);
  }, []);

  return [input, setInput, onChangeInput];
};

export default customInput;
