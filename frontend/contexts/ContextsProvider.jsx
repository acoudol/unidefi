import UserProvider, {UserContext} from "../contexts/UserContext.jsx";
import PoolProvider from "../contexts/PoolContext";

const ContextsProvider = ({children}) => {
    return (
        <UserProvider>
            <PoolProvider>
                {children}
            </PoolProvider>
        </UserProvider>
    )
};

export default ContextsProvider