import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function CreateAddsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <OverviewAppView />
    </>
  );
}
