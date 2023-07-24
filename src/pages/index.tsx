import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { AiOutlineEdit } from 'react-icons/ai';
import { Get_All_Books_Query, Set_The_Selves } from "@/services/query/books";
import client from "@/apolloClientIntercept";
import { Get_Image_Url, Socket_Url } from "environment";
import Ratings from "@/components/ratings";
import { Modal } from "@nextui-org/react";
import EditPage from "@/components/EditBook";
import { io } from "socket.io-client";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "next-i18next";

export default function Home({ socket }: any) {
  const { t } = useTranslation();
  const router = useRouter();
  const [data1, setData] = useState<any>();
  const [showModal, setShowModal] = useState(false);

  const getAllBooks = async () => {
    try {
      const { data } = await client.mutate({
        mutation: Get_All_Books_Query,
      });
      setData(data.books);
    } catch (error) {
      console.error(error);
    }
  };

  const Set_TheSelve = async (event: any, book_id: any) => {
    try {
      const { data } = await client.mutate({
        mutation: Set_The_Selves,
        variables: {
          shelve: { book_id, status: event.target.value },
        },
      });
    } catch (error) {
      toast("Something went wrong");
    }
  };

  const handleEditClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (!Cookies.get("user")) {
      router.push("/user/login");
      return;
    }
    getAllBooks();
  }, []);

  useEffect(() => {
    const socket = io(Socket_Url);
    socket?.on("book-rating", (data: any) => {
      setData((prevData: any[]) => {
        const updatedData = prevData.map((item: any) => {
          if (item._id === data.book._id) {
            return { ...item, average_rating: data.book.average_rating };
          }
          return item;
        });
        return updatedData;
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>GoodReads WebApp</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>
          <div>
            <table className="w-full">
              <thead>
                <tr>
                  <th> {t("COVER")}</th>
                  <th>{t("TITLE")}</th>
                  <th>{t("AUTHOR")}</th>
                  <th>{t("AVARAGE_RATING")}</th>
                  <th>{t("DATE_ADDED")}</th>
                  <th>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {data1?.map((user: any) => {
                  console.log(user)
                  return (
                    <tr>
                      <td className="text-center">
                        <img
                          className="m-auto"
                          src={`${Get_Image_Url}${user?.cover_Image}`}
                          alt="cover"
                          width="100"
                          max-height="150"
                        />
                      </td>
                      <td className="text-center">{user?.title}</td>
                      <td className="text-center">{user?.author}</td>
                      <td className="text-center">
                        <Ratings user={user} />
                      </td>

                      <td className="text-center">{user?.date}</td>
                      <td className="text-center">
                        <div className="flex justify-around">
                          <select
                          value={user?.status}
                            className="border rounded"
                            onChange={(event) => Set_TheSelve(event, user?._id)}
                          >
                            <option value="Want to read">Want to read</option>
                            <option value="Reading">Reading</option>
                            <option value="Read">Read</option>
                          </select>
                          <h2 onClick={handleEditClick}>
                          <AiOutlineEdit size={32} color="black" />
                          </h2>
                          <Modal
                            width="80%"
                            open={showModal}
                            onClose={handleModalClose}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                          >
                            <EditPage
                              userData={user}
                              setShowModal={setShowModal}
                            />
                          </Modal>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Toaster />
          </div>
        </div>
      </main>
    </>
  );
}
