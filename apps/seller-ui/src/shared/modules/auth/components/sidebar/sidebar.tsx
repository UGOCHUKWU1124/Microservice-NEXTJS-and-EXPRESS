"use client";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import SidebarItem from "./sidebar.item";
import SidebarMenu from "./sidebar.menu";
import {
  BellPlus,
  CalendarPlus,
  Mail,
  PackageSearch,
  SettingsIcon,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import useSidebar from "apps/seller-ui/src/hooks/useSidebar";
import useSeller from "apps/seller-ui/src/hooks/useSeller";
import UGoesShopOnlineLogo from "apps/seller-ui/src/app/assets/svgs/logo";
import {
  DashboardIcon,
  LogoutIcon,
  NotificationsIcon,
  OrdersIcon,
  PaymentIcon,
} from "apps/seller-ui/src/app/assets/svgs/icons/icons";

const SideBarWrapper = () => {
  // updating the sidebar based on the current url
  const { activeSidebar, setActiveSidebar } = useSidebar();
  const pathName = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSidebar(pathName);
  }, [pathName, setActiveSidebar]);

  const getIconColor = (route: string) =>
    activeSidebar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100vh",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: "0",
        overflow: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link href={"/dashboard"} className="flex justify-center text-center">
            <UGoesShopOnlineLogo />

            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name}
              </h3>

              <h5 className="text-xs pl-2 font-medium text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px]">
                {seller?.shop?.address}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>
      <div className=" block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            title="Dashboard"
            icon={<DashboardIcon color={getIconColor("/dashboard")} />}
            isActive={activeSidebar === "/dashboard"}
            href="/dashboard"
          />

          <div className="mt-2 block">
            <SidebarMenu title="Main Menu">
              <SidebarItem
                title="Orders"
                icon={<OrdersIcon color={getIconColor("/dashboard/orders")} />}
                isActive={activeSidebar === "/dashboard/orders"}
                href="/dashboard/orders"
              />

              <SidebarItem
                title="Payments"
                icon={
                  <PaymentIcon color={getIconColor("/dashboard/payments")} />
                }
                isActive={activeSidebar === "/dashboard/payments"}
                href="/dashboard/payments"
              />
            </SidebarMenu>
            <SidebarMenu title="Products">
              <SidebarItem
                title="Create Product"
                icon={
                  <SquarePlus
                    size={24}
                    color={getIconColor("/dashboard/create-product")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-product"}
                href="/dashboard/create-product"
              />

              <SidebarItem
                title="All Products"
                icon={
                  <PackageSearch
                    size={22}
                    color={getIconColor("/dashboard/all-products")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-products"}
                href="/dashboard/all-products"
              />
            </SidebarMenu>

            <SidebarMenu title="Events">
              <SidebarItem
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor("/dashboard/create-event")}
                  />
                }
                isActive={activeSidebar === "/dashboard/create-event"}
                href="/dashboard/create-event"
              />

              <SidebarItem
                title="All Events"
                icon={
                  <BellPlus
                    size={22}
                    color={getIconColor("/dashboard/all-events")}
                  />
                }
                isActive={activeSidebar === "/dashboard/all-events"}
                href="/dashboard/all-events"
              />
            </SidebarMenu>

            <SidebarMenu title="Controllers">
              <SidebarItem
                title="Inbox"
                icon={
                  <Mail size={22} color={getIconColor("/dashboard/inbox")} />
                }
                isActive={activeSidebar === "/dashboard/inbox"}
                href="/dashboard/inbox"
              />

              <SidebarItem
                title="Settings"
                icon={
                  <SettingsIcon
                    size={22}
                    color={getIconColor("/dashboard/settings")}
                  />
                }
                isActive={activeSidebar === "/dashboard/settings"}
                href="/dashboard/settings"
              />

              <SidebarItem
                title="Notifications"
                icon={
                  <NotificationsIcon
                    size={22}
                    color={getIconColor("/dashboard/notifications")}
                  />
                }
                isActive={activeSidebar === "/dashboard/notifications"}
                href="/dashboard/notifications"
              />
            </SidebarMenu>

            <SidebarMenu title="Extras">
              <SidebarItem
                title="Discount codes"
                icon={
                  <TicketPercent
                    size={22}
                    color={getIconColor("/dashboard/discount-codes")}
                  />
                }
                isActive={activeSidebar === "/dashboard/discount-codes"}
                href="/dashboard/discount-codes"
              />

              <SidebarItem
                title="Logout"
                icon={
                  <LogoutIcon
                    size={22}
                    color={getIconColor("/dashboard/logout")}
                  />
                }
                isActive={activeSidebar === "/dashboard/logout"}
                href="/"
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
