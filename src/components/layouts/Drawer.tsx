import React, { useEffect, useState, type FC } from "react";
import { Outlet, useLocation, matchRoutes, useParams } from "react-router-dom";
import {
  Box,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  Drawer as MuiDrawer,
  Collapse,
  Icon,
} from "@mui/material";
import { Breadcrumb } from "@roswell/ui-components";
import { styled } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLangNavigate } from "@roswell/hooks";
import { globalActions } from "@/store/global.slice";
import useDispatch from "@/hooks/use-app-dispatch";
import useSelector from "@/hooks/use-app-selector";

interface DrawerMenuProps {
  routes: any;
  icons?: any;
}
export interface DrawerProps {
  /**
   * The route object that was used to match.
   */
  routes?: any;
  /**
   * get the custom icons from project
   */
  icons?: any;
  /**
   * give the componentPlugins to change default component
   */
  componentPlugins?: {
    DrawerHeader?: FC;
    DrawerMenu?: FC<DrawerMenuProps>;
    DrawerMenuHeader?: FC;
    DrawerBreadcrumb?: FC;
  };
}

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  borderRadius: 0,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Drawer = (props: DrawerProps) => {
  const { routes, icons, componentPlugins } = props;
  const navigate = useLangNavigate();
  const dispatch = useDispatch();
  const isDrawerOpen = useSelector((state) => state.global.isDrawerOpen);
  const [routeCollapseOpen, setRouteCollapseOpen] = useState<
    Record<string, boolean>
  >({});
  const location = useLocation();
  const params = useParams();
  const { lang } = params;

  const matchedRoute =
    matchRoutes(routes, location, (lang && `/${lang}`) || "") || [];
  const handleDrawer = () => {
    dispatch(globalActions.toggleDrawer());
  };

  useEffect(() => {
    if (routes.length) {
      const matchRoutePath: Record<string, boolean> = {};
      matchedRoute
        .map((route: any) => {
          return route.pathname;
        })
        .forEach((path: string) => {
          matchRoutePath[path] = true;
        });
      setRouteCollapseOpen(matchRoutePath);
    }
  }, [routes]);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={isDrawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {componentPlugins?.DrawerHeader ? (
            <componentPlugins.DrawerHeader />
          ) : (
            <Box display="flex" alignItems="center" width={1}>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}>
                Drawer Layout
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <MuiDrawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRadius: 0,
          },
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}>
        <DrawerHeader>
          {componentPlugins?.DrawerMenuHeader && (
            <componentPlugins.DrawerMenuHeader />
          )}
        </DrawerHeader>
        <Divider />
        {componentPlugins?.DrawerMenu ? (
          <componentPlugins.DrawerMenu routes={routes} icons={icons} />
        ) : (
          <List>
            {routes.map((route: any) => {
              const rootPath = `/${route.path}`;
              const routeIconPath = route.icon;
              route.icon =
                typeof routeIconPath === "string" &&
                routeIconPath.match("icons/") &&
                icons &&
                icons[routeIconPath.replace(/icons\//i, "")]
                  ? icons[routeIconPath.replace(/icons\//i, "")]
                  : routeIconPath;

              return (
                <React.Fragment key={rootPath}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        !!matchedRoute.find(
                          (item: any) => item.pathname === rootPath
                        )
                      }
                      onClick={() => {
                        if (!route.children || route.children.length <= 0) {
                          navigate(rootPath);
                        } else {
                          setRouteCollapseOpen({
                            ...routeCollapseOpen,
                            [rootPath]: !routeCollapseOpen[rootPath],
                          });
                        }
                      }}>
                      <ListItemIcon>
                        <Box>
                          {typeof route.icon === "string" && (
                            <Icon>{route.icon}</Icon>
                          )}
                          {typeof route.icon === "object" &&
                            React.isValidElement(route.icon) &&
                            route.icon}
                          {(typeof route.icon === "function" ||
                            (typeof route.icon === "object" &&
                              !React.isValidElement(route.icon))) && (
                            <route.icon />
                          )}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={<FormattedMessage id={route.title} />}
                      />
                      {route.children && route.children.length > 0 ? (
                        routeCollapseOpen[rootPath] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                      ) : (
                        <></>
                      )}
                    </ListItemButton>
                  </ListItem>
                  {route.children && route.children.length > 0 && (
                    <Collapse
                      in={routeCollapseOpen[rootPath]}
                      timeout="auto"
                      unmountOnExit>
                      <List component="div" disablePadding>
                        {route.children.map((childrenRoute: any) => {
                          const childrenPath = `${rootPath}/${childrenRoute.path}`;
                          return (
                            <ListItemButton
                              selected={
                                !!matchedRoute.find(
                                  (item: any) => item.pathname === childrenPath
                                )
                              }
                              onClick={() => navigate(childrenPath)}
                              key={childrenRoute.path}
                              sx={{ pl: 9 }}>
                              <ListItemText
                                primary={
                                  <FormattedMessage id={childrenRoute.title} />
                                }
                              />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  )}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </MuiDrawer>
      <Main open={isDrawerOpen}>
        <DrawerHeader />
        <Box p={3} pb="8px">
          {componentPlugins?.DrawerBreadcrumb ? (
            <componentPlugins.DrawerBreadcrumb />
          ) : (
            <Breadcrumb routes={routes} enableIcon={true} />
          )}
        </Box>
        <Box>
          <Outlet />
        </Box>
      </Main>
    </Box>
  );
};

export default Drawer;
