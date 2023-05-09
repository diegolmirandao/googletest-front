import { formatPermission } from './../utils/format';
import { MPermission } from '../models/user/permission';
import { AbilityBuilder, MongoAbility, createMongoAbility } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'view' | 'create' | 'update' | 'delete' | 'activate' | 'suspend' | 'cancel' | 'assign'

export type AppAbility = MongoAbility<[Actions, Subjects]> | undefined

export const AppAbility = createMongoAbility as any
export type ACLObj = {
  action: Actions
  subject: string
}

const defineRules = (permissions: MPermission[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // Permiso por defecto para poder visualizar la Home
  can('view', 'home')

  for (const permission of permissions) {
    const formattedPermission = formatPermission(permission)

    can(formattedPermission.action, formattedPermission.subject)
  }

  return rules
}

export const buildAbility = (permissions: MPermission[]): AppAbility => {
  return new AppAbility(defineRules(permissions), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRules
