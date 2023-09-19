import { type IsBeRoute } from "@/@types/route";

export default [
  /**
   * THE LAYOUT SHOULD BE THE FIRST CHILD OF THE MAIN ROUTE
   * WE WILL HANDLE THE AUTHENTICATION AND REDIRECT IN THE LAYOUT
   */
  {
    id: "root",
    element: "pages/(main)/layout",
    children: [
      {
        title: "title.index.page",
        id: "index-page",
        icon: "folder_shared",
        path: "",
        element: "pages/(main)/index/page",
        disabledBreadcrumbLink: true,
        hiddenNavigation: false,
        hiddenBreadcrumb: false,
        // needPermission: true,
        // rule: (me) => false,
      },
      {
        title: "title.foo.page",
        id: "foo-page",
        icon: "folder_shared",
        path: "foo",
        // needPermission: true,
        // acl: ["test"],
        element: "pages/(main)/foo/page",
        disabledBreadcrumbLink: true,
        hiddenNavigation: false,
        hiddenBreadcrumb: false,
      },
    ],
  },
  {
    path: "auth",
    id: "auth-layout-1",
    redirect: "/auth/login",
    element: "@roswell/Basic",
    children: [
      {
        id: "auth-layout-2",
        path: "",
        element: "pages/auth/layout",
        children: [
          {
            id: "auth-children-1",
            path: "login",
            element: "pages/auth/login/page",
          },
        ],
      },
    ],
  },
  {
    path: "maintenance",
    id: "maintenance",
    element: "pages/maintenance/page",
  },
] satisfies IsBeRoute[];
