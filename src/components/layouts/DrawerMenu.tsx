/** @format */

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Icon,
  ListItemText,
  Collapse,
  Box,
} from "@mui/material";
import { useLangNavigate } from "@roswell/hooks";
import { useLogout } from "@/services/authServices";
import React, { Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { matchRoutes, useParams } from "react-router-dom";
import Permission from "@/components/ACL/Permission";
import FeatureToggle from "@/components/ACL/FeatureToggle";
import ProjectConfig from "@/project.config.json";
import useDispatch from "@/hooks/use-app-dispatch";
import { globalActions } from "@/store/global.slice";
import { type IsBeRoute } from "@/@types/route";

interface DrawerMenuProps {
  routes: Omit<IsBeRoute, "index">[] & { index?: false | undefined };
  icons?: any;
}

const DrawerMenu = (props: DrawerMenuProps) => {
  const featureAcl = ProjectConfig.featureAcl;
  const dispatch = useDispatch();

  const { routes, icons } = props;
  const navigate = useLangNavigate();
  const params = useParams();
  const { lang } = params;
  const matchedRoute =
    matchRoutes(routes as any, location, (lang && `/${lang}`) || "") || [];
  const [routeCollapseOpen, setRouteCollapseOpen] = useState<
    Record<string, boolean>
  >({});

  const { mutate: logout, isLoading } = useLogout({
    onSuccess: () => {
      navigate("/auth/login");
    },
    onError: () => {
      dispatch(
        globalActions.snackbarRequest({
          visible: true,
          variant: "error",
          content: `登出失敗，請稍後再試`,
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        })
      );
    },
  });

  return (
    <List>
      {routes.map((route) => {
        const rootPath = `/${route.path}`;
        const id = route.id;
        const routeIconPath = route.icon;
        route.icon =
          typeof routeIconPath === "string" &&
          routeIconPath.match("icons/") &&
          icons &&
          icons[routeIconPath.replace(/icons\//i, "")]
            ? icons[routeIconPath.replace(/icons\//i, "")]
            : routeIconPath;
        const haveFeatureAcl = Object.keys(featureAcl).length > 0;
        const FeatureToggleWrapParentComponent = haveFeatureAcl
          ? FeatureToggle
          : React.Fragment;
        const featureToggleWrapParentProps =
          haveFeatureAcl && route.path ? { id: route.element } : {};
        const WrapParentComponent = route.needPermission
          ? Permission
          : React.Fragment;
        const wrapParentProps = route.needPermission
          ? {
              acl: route?.acl,
              useDevMode: {
                enabled: route?.useDevMode?.enabled,
                env: route?.useDevMode?.env,
                roles: route?.useDevMode?.roles,
              },
              rule: route?.rule,
            }
          : {};
        return (
          <FeatureToggleWrapParentComponent
            {...featureToggleWrapParentProps}
            key={`${rootPath}${id}`}>
            <WrapParentComponent key={rootPath} {...wrapParentProps}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    route.selected ||
                    !!matchedRoute.find((item) => item.pathname === rootPath)
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
                    {route.children.map((childrenRoute) => {
                      const childrenPath = `${rootPath}/${childrenRoute.path}`;
                      const id = childrenRoute.id;
                      const FeatureToggleWrapParentComponent = haveFeatureAcl
                        ? FeatureToggle
                        : React.Fragment;
                      const featureToggleWrapParentProps =
                        haveFeatureAcl && childrenRoute.path
                          ? { id: childrenRoute.element }
                          : {};
                      const WrapParentComponent = childrenRoute.needPermission
                        ? Permission
                        : React.Fragment;

                      const wrapParentProps = childrenRoute.needPermission
                        ? {
                            acl: childrenRoute?.acl,
                            useDevMode: {
                              enabled: childrenRoute?.useDevMode?.enabled,
                              env: childrenRoute?.useDevMode?.env,
                              roles: childrenRoute?.useDevMode?.roles,
                            },
                            rule: childrenRoute?.rule,
                          }
                        : {};

                      const routeIncludeChildrenPath = matchedRoute.find(
                        (item) => item.pathname.includes(childrenPath)
                      )?.pathname;

                      return (
                        <Fragment key={`${childrenPath}${id}`}>
                          {!childrenRoute.hideInMenu && (
                            <FeatureToggleWrapParentComponent
                              {...featureToggleWrapParentProps}>
                              <WrapParentComponent {...wrapParentProps}>
                                <ListItemButton
                                  selected={
                                    (childrenRoute.selected &&
                                      !!routeIncludeChildrenPath) ||
                                    !!matchedRoute.find(
                                      (item) => item.pathname === childrenPath
                                    )
                                  }
                                  onClick={() => navigate(childrenPath)}
                                  sx={{
                                    pl: 9,
                                    backgroundColor: "rgba(0, 0, 0, 0.12)",
                                    "&.Mui-selected": {
                                      backgroundColor: "#003B72",
                                    },
                                    "&.Mui-selected:hover": {
                                      backgroundColor: "#003B72",
                                    },
                                  }}>
                                  <ListItemText
                                    primary={
                                      <FormattedMessage
                                        id={childrenRoute.title}
                                      />
                                    }
                                  />
                                </ListItemButton>
                              </WrapParentComponent>
                            </FeatureToggleWrapParentComponent>
                          )}
                        </Fragment>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </WrapParentComponent>
          </FeatureToggleWrapParentComponent>
        );
      })}
      <ListItem disablePadding>
        <ListItemButton
          disabled={isLoading}
          onClick={() => {
            logout();
          }}>
          <ListItemIcon>
            <Box>
              <Icon>logout</Icon>
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <>
                <FormattedMessage id="title.logout" defaultMessage="登出" />
              </>
            }
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default DrawerMenu;
