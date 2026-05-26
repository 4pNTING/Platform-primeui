import { MenuModal } from '@/types/layout';
import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model: MenuModal[] = [
        {
            label: 'Dashboards',
            icon: 'pi pi-home',
            items: [
                {
                    label: 'E-Commerce',
                    icon: 'pi pi-fw pi-home',
                    to: '/'
                }
            ]
        },
        { separator: true },
        {
            label: 'User Management',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-list',
                    to: '/profile/list'
                },
                {
                    label: 'Create',
                    icon: 'pi pi-fw pi-plus',
                    to: '/profile/create'
                }
            ]
        },
        { separator: true },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            items: [
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/pages/crud'
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/empty'
                },
                {
                    label: 'Clean Example',
                    icon: 'pi pi-fw pi-code',
                    to: '/pages/clean-example'
                },
                {
                    label: 'Help',
                    icon: 'pi pi-fw pi-question-circle',
                    to: '/pages/help'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
