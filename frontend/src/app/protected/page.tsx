import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next";

const Protected: React.FC = () => {
  return (
    <div>
      <h1>Protected Page</h1>
      <p>You are logged in.</p>
    </div>
  );
};

export default Protected;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
