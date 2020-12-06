import React from 'react'
import HomeIcon from '@material-ui/icons/Home';
import QueueIcon from '@material-ui/icons/Queue';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

export const SidebarData = [
    {
        title: "Panel Administrativo",
        icon: <HomeIcon/>,
        link:  "/Home",
        id: "Home",
    },
    {
        title: "Añadir cliente",
        icon: <QueueIcon/>,
        link:  "/AddClient",
        id: "AddClient",
    },
    {
        title: "Verificaciones",
        icon: <CheckBoxIcon/>,
        link:  "/Verificaciones",
        id: "Verificaciones",
    },
    {
        title: "Calificación interna",
        icon: <EventAvailableIcon/>,
        link:  "/CalificacionInterna",
        id: "CalificacionInterna",
    },
];