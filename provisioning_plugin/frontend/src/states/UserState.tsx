import { create } from 'zustand';

import axios from 'axios';
import { useLocalState } from './LocalState';
import { apiUrl } from '../lib/Api';
import type { ModelType } from '../types/ModelType';
import { ApiEndpoints } from '../lib/ApiEndpoints';

export enum UserPermissions {
  view = 'view',
  add = 'add',
  change = 'change',
  delete = 'delete',
}

export enum UserRoles {
  admin = 'admin',
  build = 'build',
  part = 'part',
  part_category = 'part_category',
  purchase_order = 'purchase_order',
  return_order = 'return_order',
  sales_order = 'sales_order',
  stock = 'stock',
  stock_location = 'stock_location',
  stocktake = 'stocktake',
}

export function clearCsrfCookie() {
  document.cookie =
    'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

export const api = axios.create({});

/*
 * Setup default settings for the Axios API instance.
 */
export function setApiDefaults() {
  const { getHost } = useLocalState.getState();

  api.defaults.baseURL = getHost();
  api.defaults.timeout = 5000;

  api.defaults.withCredentials = true;
  api.defaults.withXSRFToken = true;
  api.defaults.xsrfCookieName = 'csrftoken';
  api.defaults.xsrfHeaderName = 'X-CSRFToken';

  axios.defaults.withCredentials = true;
  axios.defaults.withXSRFToken = true;
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  axios.defaults.xsrfCookieName = 'csrftoken';
}

/**
 * Global user information state, using Zustand manager
 */
export const useUserState = create<any>((set, get) => ({
  user: undefined,
  is_authed: false,
  setAuthenticated: (authed = true) => {
    set({ is_authed: authed });
    setApiDefaults();
  },
  userId: () => {
    const user: any = get().user as any;
    return user?.pk;
  },
  username: () => {
    const user: any = get().user as any;

    if (user?.first_name || user?.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    } else {
      return user?.username ?? '';
    }
  },
  setUser: (newUser: any | undefined) => set({ user: newUser }),
  getUser: () => get().user,
  clearUserState: () => {
    set({ user: undefined, is_authed: false });
    clearCsrfCookie();
    setApiDefaults();
  },
  fetchUserToken: async () => {
    // If neither the csrf or session cookies are available, we cannot fetch a token
    if (
      !document.cookie.includes('csrftoken') &&
      !document.cookie.includes('sessionid')
    ) {
      get().setAuthenticated(false);
      return;
    }

    await api
      .get(apiUrl(ApiEndpoints.auth_session))
      .then((response) => {
        if (response.status == 200 && response.data.meta.is_authenticated) {
          get().setAuthenticated(true);
        } else {
          get().setAuthenticated(false);
        }
      })
      .catch(() => {
        get().setAuthenticated(false);
      });
  },
  fetchUserState: async () => {
    if (!get().isAuthed()) {
      await get().fetchUserToken();
    }

    // If we still don't have a token, clear the user state and return
    if (!get().isAuthed()) {
      get().clearUserState();
      return;
    }

    // Fetch user data
    await api
      .get(apiUrl(ApiEndpoints.user_me), {
        timeout: 2000,
      })
      .then((response) => {
        if (response.status == 200) {
          const user: any = {
            pk: response.data.pk,
            first_name: response.data?.first_name ?? '',
            last_name: response.data?.last_name ?? '',
            email: response.data.email,
            username: response.data.username,
            groups: response.data.groups,
            profile: response.data.profile,
          };
          get().setUser(user);
          // profile info
        } else {
          get().clearUserState();
        }
      })
      .catch(() => {
        get().clearUserState();
      });

    if (!get().isLoggedIn()) {
      return;
    }

    // Fetch role data
    await api
      .get(apiUrl(ApiEndpoints.user_roles))
      .then((response) => {
        if (response.status == 200) {
          const user: any = get().user as any;

          // Update user with role data
          if (user) {
            user.roles = response.data?.roles ?? {};
            user.permissions = response.data?.permissions ?? {};
            user.is_staff = response.data?.is_staff ?? false;
            user.is_superuser = response.data?.is_superuser ?? false;
            get().setUser(user);
          }
        } else {
          get().clearUserState();
        }
      })
      .catch((_error) => {
        console.error('ERR: Error fetching user roles');
        get().clearUserState();
      });
  },
  isAuthed: () => {
    return get().is_authed;
  },
  isLoggedIn: () => {
    if (!get().isAuthed()) {
      return false;
    }
    const user: any = get().user as any;
    return !!user && !!user.pk;
  },
  isStaff: () => {
    const user: any = get().user as any;
    return user?.is_staff ?? false;
  },
  isSuperuser: () => {
    const user: any = get().user as any;
    return user?.is_superuser ?? false;
  },
  checkUserRole: (role: UserRoles, permission: UserPermissions) => {
    // Check if the user has the specified permission for the specified role
    const user: any = get().user as any;

    if (!user) {
      return false;
    }

    if (user?.is_superuser) return true;
    if (user?.roles === undefined) return false;
    if (user?.roles[role] === undefined) return false;
    if (user?.roles[role] === null) return false;

    return user?.roles[role]?.includes(permission) ?? false;
  },
  hasDeleteRole: (role: UserRoles) => {
    return get().checkUserRole(role, UserPermissions.delete);
  },
  hasChangeRole: (role: UserRoles) => {
    return get().checkUserRole(role, UserPermissions.change);
  },
  hasAddRole: (role: UserRoles) => {
    return get().checkUserRole(role, UserPermissions.add);
  },
  hasViewRole: (role: UserRoles) => {
    return get().checkUserRole(role, UserPermissions.view);
  },
  checkUserPermission: (model: ModelType, permission: UserPermissions) => {
    // Check if the user has the specified permission for the specified model
    const user: any = get().user as any;

    if (!user) {
      return false;
    }

    if (user?.is_superuser) return true;

    if (user?.permissions === undefined) return false;
    if (user?.permissions[model] === undefined) return false;
    if (user?.permissions[model] === null) return false;

    return user?.permissions[model]?.includes(permission) ?? false;
  },
  hasDeletePermission: (model: ModelType) => {
    return get().checkUserPermission(model, UserPermissions.delete);
  },
  hasChangePermission: (model: ModelType) => {
    return get().checkUserPermission(model, UserPermissions.change);
  },
  hasAddPermission: (model: ModelType) => {
    return get().checkUserPermission(model, UserPermissions.add);
  },
  hasViewPermission: (model: ModelType) => {
    return get().checkUserPermission(model, UserPermissions.view);
  },
}));
