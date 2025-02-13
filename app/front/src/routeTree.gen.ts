/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as RegisterImport } from './routes/register'
import { Route as LoginImport } from './routes/login'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as IndexImport } from './routes/index'
import { Route as AuthenticatedDriveImport } from './routes/_authenticated/drive'
import { Route as AuthenticatedDriveIndexImport } from './routes/_authenticated/drive/index'
import { Route as AuthenticatedDriveFolderPathImport } from './routes/_authenticated/drive/$folderPath'

// Create/Update Routes

const RegisterRoute = RegisterImport.update({
  id: '/register',
  path: '/register',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedDriveRoute = AuthenticatedDriveImport.update({
  id: '/drive',
  path: '/drive',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDriveIndexRoute = AuthenticatedDriveIndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => AuthenticatedDriveRoute,
} as any)

const AuthenticatedDriveFolderPathRoute =
  AuthenticatedDriveFolderPathImport.update({
    id: '/$folderPath',
    path: '/$folderPath',
    getParentRoute: () => AuthenticatedDriveRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/register': {
      id: '/register'
      path: '/register'
      fullPath: '/register'
      preLoaderRoute: typeof RegisterImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/drive': {
      id: '/_authenticated/drive'
      path: '/drive'
      fullPath: '/drive'
      preLoaderRoute: typeof AuthenticatedDriveImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/drive/$folderPath': {
      id: '/_authenticated/drive/$folderPath'
      path: '/$folderPath'
      fullPath: '/drive/$folderPath'
      preLoaderRoute: typeof AuthenticatedDriveFolderPathImport
      parentRoute: typeof AuthenticatedDriveImport
    }
    '/_authenticated/drive/': {
      id: '/_authenticated/drive/'
      path: '/'
      fullPath: '/drive/'
      preLoaderRoute: typeof AuthenticatedDriveIndexImport
      parentRoute: typeof AuthenticatedDriveImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedDriveRouteChildren {
  AuthenticatedDriveFolderPathRoute: typeof AuthenticatedDriveFolderPathRoute
  AuthenticatedDriveIndexRoute: typeof AuthenticatedDriveIndexRoute
}

const AuthenticatedDriveRouteChildren: AuthenticatedDriveRouteChildren = {
  AuthenticatedDriveFolderPathRoute: AuthenticatedDriveFolderPathRoute,
  AuthenticatedDriveIndexRoute: AuthenticatedDriveIndexRoute,
}

const AuthenticatedDriveRouteWithChildren =
  AuthenticatedDriveRoute._addFileChildren(AuthenticatedDriveRouteChildren)

interface AuthenticatedRouteChildren {
  AuthenticatedDriveRoute: typeof AuthenticatedDriveRouteWithChildren
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedDriveRoute: AuthenticatedDriveRouteWithChildren,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/drive': typeof AuthenticatedDriveRouteWithChildren
  '/drive/$folderPath': typeof AuthenticatedDriveFolderPathRoute
  '/drive/': typeof AuthenticatedDriveIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/drive/$folderPath': typeof AuthenticatedDriveFolderPathRoute
  '/drive': typeof AuthenticatedDriveIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/register': typeof RegisterRoute
  '/_authenticated/drive': typeof AuthenticatedDriveRouteWithChildren
  '/_authenticated/drive/$folderPath': typeof AuthenticatedDriveFolderPathRoute
  '/_authenticated/drive/': typeof AuthenticatedDriveIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/login'
    | '/register'
    | '/drive'
    | '/drive/$folderPath'
    | '/drive/'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '' | '/login' | '/register' | '/drive/$folderPath' | '/drive'
  id:
    | '__root__'
    | '/'
    | '/_authenticated'
    | '/login'
    | '/register'
    | '/_authenticated/drive'
    | '/_authenticated/drive/$folderPath'
    | '/_authenticated/drive/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  LoginRoute: typeof LoginRoute
  RegisterRoute: typeof RegisterRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute: LoginRoute,
  RegisterRoute: RegisterRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_authenticated",
        "/login",
        "/register"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/drive"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/register": {
      "filePath": "register.tsx"
    },
    "/_authenticated/drive": {
      "filePath": "_authenticated/drive.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/drive/$folderPath",
        "/_authenticated/drive/"
      ]
    },
    "/_authenticated/drive/$folderPath": {
      "filePath": "_authenticated/drive/$folderPath.tsx",
      "parent": "/_authenticated/drive"
    },
    "/_authenticated/drive/": {
      "filePath": "_authenticated/drive/index.tsx",
      "parent": "/_authenticated/drive"
    }
  }
}
ROUTE_MANIFEST_END */
