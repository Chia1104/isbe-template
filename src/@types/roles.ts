export enum RolesEnum {
  SUPER_ADMIN = "superAdmin",
  ACCOUNT_ADMIN = "accountAdmin",
  FINANCE_OFFICER = "financeOfficer",
  POINT_ADMIN = "pointAdmin",
  CUSTOMER_OFFICER = "customerOfficer",
  TEST = "test",
}

export type Role = `${RolesEnum}`;
