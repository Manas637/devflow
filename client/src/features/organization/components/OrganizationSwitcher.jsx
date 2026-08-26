import {
  Check,
  ChevronsUpDown,
  Plus,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  setCurrentOrganization,
} from "@/store/organization/organization.slice";

import useCurrentOrganization from "../hooks/useCurrentOrganization";
import useGetOrganizations from "../hooks/useGetOrganizations";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function OrganizationSwitcher() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const {
    organizationId,
    organization,
  } = useCurrentOrganization();

  const {
    data,
    isLoading,
  } = useGetOrganizations();

  const organizations =
    data?.data?.data ?? [];

  const handleSelect = (id) => {
    /*
     * Close the popover even if the user
     * selects the already active organization.
     */
    setOpen(false);

    /*
     * Don't dispatch if it's already active.
     */
    if (id === organizationId) {
      return;
    }

    dispatch(
      setCurrentOrganization(id)
    );
  };

  const handleCreateOrganization = () => {
    setOpen(false);

    navigate("/organization/create");
  };

  if (!organization && isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            disabled
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
              <span className="text-xs">
                ...
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!organization) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover
          open={open}
          onOpenChange={setOpen}
        >
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-auto py-2"
              tooltip="Switch organization"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                {organization.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">
                  {organization.name}
                </p>

                <p className="truncate text-xs text-muted-foreground">
                  Switch organization
                </p>
              </div>

              <ChevronsUpDown className="ml-auto size-4 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </PopoverTrigger>

          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            className="w-64 p-0"
          >
            <Command>
              <CommandList>

                <CommandEmpty>
                  No organizations found.
                </CommandEmpty>

                <CommandGroup heading="Organizations">
                  {organizations.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={() =>
                        handleSelect(item.id)
                      }
                      className="cursor-pointer"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
                        {item.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <span className="min-w-0 flex-1 truncate">
                        {item.name}
                      </span>

                      {item.id === organizationId && (
                        <Check className="size-4 text-primary" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>

                <CommandGroup>
                  <CommandItem
                    className="cursor-pointer"
                    onSelect={handleCreateOrganization}
                  >
                    <Plus className="size-4" />

                    <span>
                      Create organization
                    </span>
                  </CommandItem>
                </CommandGroup>

              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}