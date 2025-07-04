import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <>
            <div className="h-[100vh] flex flex-col justify-center items-center">
                <div className="grid gap-4 justify-center">
                    <h1 className="text-4xl font-bold">ERROR 404</h1>
                    <p className="font-semibold text-gray-500 italic">PAGE NOT FOUND</p>
                    <Link to="/dashboard"><button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg shadow-sm shadow-black">GOT TO DASHBOARD</button></Link>
                    <p>&copy; PROFITLYTICS | <span>ALL RIGHTS RESERVED.</span></p>
                </div>
            </div>
        </>
    );
}