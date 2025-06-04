import chefLogo from '../assets/chef-claud-icon.png'
function Header() {
  return (
      <>
          <header>
              <img src={chefLogo} alt="Chef Logo"/>
              <h1>Chef Claude</h1>
          </header>
      </>
  );
}

export default Header;