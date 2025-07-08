import CircularLoader, { MainLoader } from "@/Components/Spinners";

export default function Loading () {
    return <MainLoader />;
}

export function Loader () {
    return <CircularLoader />
}