import { Helmet } from 'react-helmet-async';

import { UserCardsView } from 'src/sections/plane/view';

// ----------------------------------------------------------------------

export default function SelectPlanePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <UserCardsView />
    </>
  );
}
