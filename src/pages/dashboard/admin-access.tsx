import { Helmet } from 'react-helmet-async';

import { AdminAccessListView } from 'src/sections/admin-access/view';


// ----------------------------------------------------------------------

export default function OrderListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Order List</title>
      </Helmet>

    <AdminAccessListView/>
    </>
  );
}
