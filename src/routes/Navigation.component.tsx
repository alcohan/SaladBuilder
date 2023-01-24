import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router';

import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavItemProps {
    text: string;
    url: string;
}

const Navigation = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate()

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen)
    }

    const NavItem = (props: NavItemProps) => {
        return(
            <ListItem>
                <ListItemText primary={props.text} onClick={() => {setDrawerOpen(false); navigate(props.url)}}/>
            </ListItem>
        )
    }

    const NavigationBar = () => {
        return (
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                        Salad Builder
                    </Typography>
                </Toolbar>
            </AppBar>
        )
    }

    const AppDrawer = () => {
        return (
            <Drawer open={drawerOpen} onClose={toggleDrawer} >
                <List>
                    <NavItem text="Home" url='/' />
                    <NavItem text="Recipes" url='/recipes' />
                    <NavItem text="Templates" url='/templates' />
                    <NavItem text="Ingredients" url='/ingredients' />
                </List>
            </Drawer>
        )
    }

    return (
        <>
            <NavigationBar />
            <AppDrawer />
            <Outlet />
        </>
    )
}

export default Navigation;
