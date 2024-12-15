import { Helmet } from 'react-helmet-async';

import { SelectCategoryView } from 'src/sections/plane/view';

// ----------------------------------------------------------------------

export default function SelectCategoryPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      <SelectCategoryView />
    </>
  );
}
