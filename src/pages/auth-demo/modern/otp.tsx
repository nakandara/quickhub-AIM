import { Helmet } from 'react-helmet-async';
import { ModernVerifyOtpView } from 'src/sections/auth-demo/modern';


// ----------------------------------------------------------------------

export default function ModernVerifyPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Verify</title>
      </Helmet>

      <ModernVerifyOtpView />
    </>
  );
}
