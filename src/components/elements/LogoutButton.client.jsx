import {deleteSwymLocalStorage} from '../../swym/Utils/Utils';

export function LogoutButton(props) {
  const logout = () => {
    fetch('/account/logout', {method: 'POST'}).then(() => {
      if (typeof props?.onClick === 'function') {
        props.onClick();
      }
      deleteSwymLocalStorage();
      window.location.href = '/';
    });
  };

  return (
    <button className="text-primary/50" {...props} onClick={logout}>
      Logout
    </button>
  );
}
