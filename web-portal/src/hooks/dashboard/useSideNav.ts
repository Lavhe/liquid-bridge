import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../context/FirebaseContext';
import { RoutePath } from '../../utils/utils';

export function useSideNav(){
    const { currentUser } = useFirebase();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const handleNavigate = useCallback((link:string) => {
        return navigate(link)
    }, []);
    const isCurrentRoute = useCallback((link:string) => {
        return pathname.indexOf(link) >= 0 || pathname == RoutePath.HOME && link == RoutePath.DASHBOARD
    }, [pathname])

    const [superAdminMenu] = useState([
        { selected:false,text: "Dashboard", link: RoutePath.DASHBOARD },
        { selected:false,text: "Profile", link: RoutePath.PROFILE },
        { selected:false,text: "Agent Profile", link: RoutePath.AGENT },
        { selected:false,text: "Applications", link: RoutePath.APPLICATIONS },
        { selected:false,text: "Users", link: RoutePath.USERS },
    ])

    const [menu] = useState([
        { selected:false,text: "Dashboard", link: RoutePath.DASHBOARD },
        { selected:false,text: "Profile", link: RoutePath.PROFILE },
        { selected:false,text: "Applications", link: RoutePath.APPLICATIONS },
        { selected:false,text: "Users", link: RoutePath.USERS },
    ]);

    const buttons = currentUser?.role === 'SUPER_ADMIN' ? superAdminMenu : menu;

    return { buttons, handleNavigate, isCurrentRoute }
}