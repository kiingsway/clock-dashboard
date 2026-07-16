import { useState } from "react";

type TUseBoolean = readonly [
    boolean,
    {
        readonly setTrue: () => void;
        readonly setFalse: () => void;
        readonly toggle: () => void;
    }
];

export default function useBoolean(initialValue = false): TUseBoolean {

    const [bool, setBool] = useState(initialValue);

    const setTrue = (): void => setBool(true);
    const setFalse = (): void => setBool(false);
    const toggle = (): void => setBool(prev => !prev)

    return [bool, { setTrue, setFalse, toggle }] as const;

}