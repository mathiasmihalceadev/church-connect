import {CalendarDots, House, Users, CheckCircle, Gear} from "@phosphor-icons/react";
import Link from "next/link";
import {usePathname} from "next/navigation";

export default function Toolbar() {
    const currentPath = usePathname();

    return (
        <nav
            className="md:hidden text-lead-gray flex justify-between items-center px-8 py-4 bg-white fixed bottom-0 left-0 right-0 border-t border-input-gray z-50">
            <div>
                <Link href="/home">
                    <House weight="light" size={40}
                           className={currentPath === "/home" ? "text-royal-blue" : "text-lead-gray"}/>
                </Link>
            </div>
            <div>
                <Link href="/groups">
                    <Users weight="light" size={40}
                           className={currentPath === "/groups" ? "text-royal-blue" : "text-lead-gray"}/>
                </Link>
            </div>
            <div>
                <Link href="/calendar">
                    <CalendarDots weight="light" size={40}
                                  className={currentPath === "/calendar" ? "text-royal-blue" : "text-lead-gray"}/>
                </Link>
            </div>
            <div>
                <Link href="/attendance">
                    <CheckCircle weight="regular" size={40}
                                 className={currentPath === "/attendance" ? "text-royal-blue" : "text-lead-gray"}/>
                </Link>
            </div>
            <div>
                <Link href="/settings">
                    <Gear weight="light" size={40}
                          className={currentPath === "/settings" ? "text-royal-blue" : "text-lead-gray"}/>
                </Link>
            </div>
        </nav>
    );
}
