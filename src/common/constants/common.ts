/**
 * internal server error message
 */
 export const INTERNAL_SERVER_ERROR = 'Internal server error';
 ​
 /**
  * define custom headers used in application
  */
 export const COMMON_HEADERS = {
   X_ACCESS_TOKEN: 'x-access-token',
 };
 ​
 /**
  * permissions given to user roles
  */
 export const PERMISSIONS = {
   // roles
   ROLES_INDEX: 'roles.index',
   ROLES_CREATE: 'roles.create',
   ROLES_UPDATE: 'roles.update',
   ROLES_READ: 'roles.read',
   ROLES_DELETE: 'roles.delete',
 ​
   // users
   USERS_INDEX: 'users.index',
   USERS_CREATE: 'users.create',
   USERS_UPDATE: 'users.update',
   USERS_READ: 'users.read',
   USERS_DELETE: 'users.delete',
 ​
   // banners
   BANNERS_INDEX: 'banners.index',
   BANNERS_CREATE: 'banners.create',
   BANNERS_UPDATE: 'banners.update',
   BANNERS_READ: 'banners.read',
   BANNERS_DELETE: 'banners.delete',
 ​
   // chatroom
   CHATROOM_INDEX: 'chatroom.index',
   CHATROOM_USER_MANAGE: 'chatroom.user.manage',
   CHATROOM_MESSAGE_DELETE: 'chatroom.message.delete',
 ​
   // sub-banners
   SUB_BANNERS_INDEX: 'subbanners.index',
   SUB_BANNERS_CREATE: 'subbanners.create',
   SUB_BANNERS_UPDATE: 'subbanners.update',
   SUB_BANNERS_READ: 'subbanners.read',
   SUB_BANNERS_DELETE: 'subbanners.delete',
 ​
   // entertainment
   ENTERTAINMENT_INDEX: 'entertainment.index',
   ENTERTAINMENT_CREATE: 'entertainment.create',
   ENTERTAINMENT_UPDATE: 'entertainment.update',
   ENTERTAINMENT_READ: 'entertainment.read',
   ENTERTAINMENT_DELETE: 'entertainment.delete',
 ​
   // placement
   PLACEMENT_INDEX: 'placement.index',
   PLACEMENT_CREATE: 'placement.create',
   PLACEMENT_UPDATE: 'placement.update',
   PLACEMENT_READ: 'placement.read',
   PLACEMENT_DELETE: 'placement.delete',
 ​
   // promotion
   PROMOTION_INDEX: 'promotion.index',
   PROMOTION_CREATE: 'promotion.create',
   PROMOTION_UPDATE: 'promotion.update',
   PROMOTION_READ: 'promotion.read',
   PROMOTION_DELETE: 'promotion.delete',
 ​
   // regulation
   REGULATION_INDEX: 'regulation.index',
   REGULATION_CREATE: 'regulation.create',
   REGULATION_UPDATE: 'regulation.update',
   REGULATION_READ: 'regulation.read',
   REGULATION_DELETE: 'regulation.delete',
 ​
   // message
   MESSAGE_INDEX: 'message.index',
   MESSAGE_CREATE: 'message.create',
   MESSAGE_UPDATE: 'message.update',
   MESSAGE_READ: 'message.read',
   MESSAGE_DELETE: 'message.delete',
 ​
   //mybet
   MYBET_INDEX: 'mybet.index',
   MYBET_CREATE: 'mybet.create',
   MYBET_UPDATE: 'mybet.update',
   MYBET_READ: 'mybet.read',
   MYBET_DELETE: 'mybet.delete',
 } as const;
 ​
 /**
  * typescript type to provide better security against human error
  */
 export type PermissionsValues = typeof PERMISSIONS[keyof typeof PERMISSIONS];
 ​
 /**
  * regex for links
  */
 export const LINK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
 ​
 /**
  * get record query statuses for all modules
  * @export
  * @enum {string}
  */
 export enum GET_RECORDS_QUERY_STATUSES {
   ACTIVE = 'active',
   INACTIVE = 'inactive',
   EXPIRED = 'expired',
 }