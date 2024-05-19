import { GoProjectTemplate } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineCampaign } from "react-icons/md";
import { MdOutlineAccountTree } from "react-icons/md";
import Dashboard from "../pages/Dashboard";
import Campaigns from "../pages/Campaigns";
import Accounts from "../pages/Accounts";
import Templates from "../pages/Templates";
import Logout from "../pages/Logout";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    shortPath: "/",
    Icon: IoHomeOutline,
    Element: Dashboard,
  },
  {
    title: "Campaigns",
    path: "/dashboard/campaigns",
    shortPath: "/campaigns",
    Icon: MdOutlineCampaign,
    Element: Campaigns,
  },
  {
    title: "Accounts",
    path: "/dashboard/accounts",
    shortPath: "/accounts",
    Icon: MdOutlineAccountTree,
    Element: Accounts,
  },
  {
    title: "Templates",
    path: "/dashboard/templates",
    shortPath: "/templates",
    Icon: GoProjectTemplate,
    Element: Templates,
  },
  {
    title: "Logout",
    path: "/dashboard/logout",
    shortPath: "/logout",
    Icon: MdLogout,
    Element: Logout,
  },
];
