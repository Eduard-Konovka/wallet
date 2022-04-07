import HomeTabMobile from './HomeTabMobile';
import HomeTabDesktop from './HomeTabDesktop';
import ButtonAddTransactions from 'components/ButtonAddTransactions';

import { useMediaQuery } from 'react-responsive';

function HomeTab() {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
  const isTabletOrDesktop = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div>
      {isMobile && <HomeTabMobile />}

      {isTabletOrDesktop && <HomeTabDesktop />}

      <ButtonAddTransactions />
    </div>
  );
}

export default HomeTab;
