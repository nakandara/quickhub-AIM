import { Helmet } from 'react-helmet-async';

import { TourListView } from 'src/sections/tour/view';


// ----------------------------------------------------------------------

export default function OverviewEcommercePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: E-Commerce</title>
      </Helmet>

      <TourListView />
    </>
  );
}
