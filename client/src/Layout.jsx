import { Link } from 'react-router-dom';

import { useFeaturedQuoteText } from 'misc/featured-quote/useFeaturedQuoteText';
import { ROUTE_PATHS } from 'routePaths';
import LoginModal from 'session/LoginModal';
import useSessionContext from 'session/useSessionContext';

import layoutClasses from './Layout.module.scss';

export default function Layout({ children }) {
  const { currentUser } = useSessionContext();

  return (
    <div className={layoutClasses.Layout}>
      <header className={layoutClasses.LayoutHeader}>
        <h1>Family Tree</h1>
        <span>{currentUser?.name}</span>
        <LoginModal />
        <LayoutNavigation />
      </header>
      <main className={layoutClasses.LayoutContent1}>
        <div className={layoutClasses.LayoutContent2}>{children}</div>
      </main>
      <footer className={layoutClasses.LayoutFooter}>
        <FeaturedQuote />
      </footer>
    </div>
  );
}

////////////////////

function FeaturedQuote() {
  const { currentUser } = useSessionContext();
  const { quote } = useFeaturedQuoteText();

  return currentUser?.admin ? (
    <Link to="/featured-quotes">{quote}</Link>
  ) : (
    <p>{quote}</p>
  );
}

function LayoutNavigation() {
  return (
    <div className={layoutClasses.LayoutNavigation}>
      <ul>
        <LayoutNavItem path="/" text="Home" isPublic />
        <LayoutNavItem path="/people" text="People" isPublic />
        <LayoutNavItem path="/stories" text="Stories" isPublic />
        <LayoutNavItem path="/cemeteries" text="Cemeteries" isPublic />
        <LayoutNavItem path="/sources" text="Sources" />
        <LayoutNavItem path={ROUTE_PATHS.eventIndex} text="Events" />
        <LayoutNavItem path="/notations" text="Notations" />
        <LayoutNavItem path="/map" text="Map" />
        <LayoutNavItem path="/checklists" text="Checklists" />
        <LayoutNavItem path="/tags" text="Tags" />
        <LayoutNavItem path="/utilities" text="Utilities" />
        <LayoutNavItem path="/files" text="Files" />
        <LayoutNavItem path="/account" text="Account" isPublic />
        <LayoutNavItem path="/users" text="Users" />
        <LayoutNavItem path="/404" text="404" />
        <LayoutNavItem path="http://localhost:9000/" text="old site" />
      </ul>
    </div>
  );
}

function LayoutNavItem({ path, text, isPublic }) {
  const { currentUser } = useSessionContext();
  return (
    (isPublic || currentUser?.admin) && (
      <li>
        {' '}
        <Link to={path}>{text}</Link>{' '}
      </li>
    )
  );
}
