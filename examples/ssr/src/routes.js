import AppRoot from './components/AppRoot'
import NotFound from './components/NotFound'
import UserList from './apps/users/UserList'


const routes = [{
    component: AppRoot,
    routes: [
        {
            path: '/',
            component: UserList,
            exact: true,
        },
        {
            path: '*',
            component: NotFound,
        },
    ],
}]


export default routes
