import CircularLoader, { MainLoader } from "@/Components/Spinners";

export default function Loading () {
    // You can add any UI inside Loading, including a Skeleton.
    return <MainLoader />;
}

export function Loader () {
    return <CircularLoader />
}