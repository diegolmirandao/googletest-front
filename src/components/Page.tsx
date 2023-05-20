import { ACLObj, defaultACLObj } from '../config/acl';
import type { ReactElement, ReactNode, ComponentType } from 'react'
import Layout from './layout';
import AclGuard from './auth/AclGuard';
import { SettingsProvider, SettingsConsumer } from '../context/settingsContext'
import ThemeComponent from '../components/layout/theme/ThemeComponent'
import AppLogout from '../components/auth/AppLogout'
import ProtectedPage from '../components/auth/ProtectedPage'
import OfflineWrapper from '../components/OfflineWrapper'
import WindowWrapper from '../components/WindowWrapper'
import NotificationWrapper from './NotificationWrapper';

export type PageType = ComponentType & {
    acl?: ACLObj
    authGuard?: boolean
    guestGuard?: boolean
    setConfig?: () => void
    getLayout?: (page: ReactElement) => ReactNode
}
  
const Page = (Component: PageType) => {
    const getLayout = Component.getLayout ?? (page => <Layout>{page}</Layout>)

    const setConfig = Component.setConfig ?? undefined

    const guestGuard = Component.guestGuard ?? false

    const aclAbilities = Component.acl ?? defaultACLObj

    const NewPage = (props: any) => {
        return (
            <SettingsProvider {...(setConfig ? { pageSettings: setConfig() } : {})}>
                <SettingsConsumer>
                    {({ settings }) => {
                        return (
                            <ThemeComponent settings={settings}>
                                <ProtectedPage>
                                    <AppLogout>
                                        <OfflineWrapper>
                                            <NotificationWrapper>
                                                <WindowWrapper>
                                                    <AclGuard aclAbilities={aclAbilities} guestGuard={guestGuard}>
                                                        {getLayout(<Component {...props} />)}
                                                    </AclGuard>
                                                </WindowWrapper>
                                            </NotificationWrapper>
                                        </OfflineWrapper>
                                    </AppLogout>
                                </ProtectedPage>
                            </ThemeComponent>
                        )
                    }}
                </SettingsConsumer>
          </SettingsProvider>
        )
    }
    return NewPage;
}

export default Page