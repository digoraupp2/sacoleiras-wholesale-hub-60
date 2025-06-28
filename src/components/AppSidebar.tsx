
import { useState } from "react"
import { 
  Package, 
  Users, 
  BarChart3, 
  Plus, 
  ShoppingCart,
  Tag,
  TrendingUp,
  Settings,
  FileText
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Produtos", url: "/produtos", icon: Package },
  { title: "Categorias", url: "/categorias", icon: Tag },
  { title: "Sacoleiras", url: "/sacoleiras", icon: Users },
  { title: "Lançamentos", url: "/lancamentos", icon: FileText },
  { title: "Movimentações", url: "/movimentacoes", icon: TrendingUp },
  { title: "Preços Personalizados", url: "/precos", icon: ShoppingCart },
]

const quickActions = [
  { title: "Novo Produto", url: "/produtos/novo", icon: Plus },
  { title: "Nova Sacoleira", url: "/sacoleiras/nova", icon: Plus },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavCls = (path: string) =>
    isActive(path) 
      ? "sidebar-nav-active" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"

  return (
    <Sidebar
      className={isCollapsed ? "w-16" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar">
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">Atacado Pro</h2>
                <p className="text-xs text-sidebar-foreground/60">Gestão de Sacoleiras</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Navegação"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={`${getNavCls(item.url)} flex items-center gap-3 px-3 py-2 rounded-md transition-colors`}
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Actions */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            {!isCollapsed && "Ações Rápidas"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="hover:bg-accent/20 text-sidebar-foreground/80 hover:text-accent flex items-center gap-3 px-3 py-2 rounded-md transition-colors"
                    >
                      <item.icon className="w-4 h-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
