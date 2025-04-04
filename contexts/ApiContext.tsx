"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { db, auth } from "@/config/firebase";
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import localData from "@/localData";
import useAlert from "@/hooks/alert/useAlert";

const { exampleImage } = localData.images;

type SectionsType = {
  [key: string]: any;
  // header: { title: string; description: string };
  // about: { title: string; description: string };
};

type StateType = {
  homePage: {
    id: string;
    sections: SectionsType;
  };
  isLoading: boolean;
};

type ApiContextType = {
  fetchedData: StateType;
  setFetchedData: (newState: StateType) => void;
  getContents: ({ setIsLoading }: { [key: string]: any }) => void;
  updateContent: ({ id,slug, setIsLoading, ...fields }: { [key: string]: any }) => void;
};

export const ApiContext = createContext<ApiContextType | null>(null);

export default function ApiProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fetchedData, setFetchedData] = useState<StateType>({
    homePage: {
      id: "",
      sections: {
        header: {
          title: "Header",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          images: [{ id: "1", title: "", url: exampleImage }],
        },
        about: {
          title: "About section",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          images: [{ id: "1", title: "", url: exampleImage }],
        },
        services: {
          title: "Services section",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
          images: [
            { id: "1", title: "", url: exampleImage },
            { id: "2", title: "", url: exampleImage },
            { id: "3", title: "", url: exampleImage },
          ],
        },
        contact: {
          title: "Contact section",
          description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        },
      },
    },
    isLoading: false,
  });
  const { successAlert, errorAlert } = useAlert();

  const websiteContentRef = collection(db, "website-content");

  const getContents = async ({ setIsLoading = (_: boolean) => {} }) => {
    setIsLoading(true);
    setFetchedData((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await getDocs(websiteContentRef);
      const data = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(data, " kkk");
      setFetchedData((prev) => ({
        ...prev,
        homePage: {
          id: data[0].id,
          sections: { ...data[0] },
        },
        // aboutPage: {
        //   sections: { ...data[1] },
        // },
      }));
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=getContents= request error");
    }
    setIsLoading(false);
    setFetchedData((prev) => ({ ...prev, isLoading: false }));
  };

  const updateContent = async ({ id = "",slug = '', setIsLoading = (_: boolean) => {}, ...fields }) => {
    setIsLoading(true);

    const filteredData = {
      [slug]: { ...Object.fromEntries(Object.entries(fields).filter(([_, v]) => v)) },
      updatedAt: new Date(),
    };

    console.log(filteredData, ' filteredData')

    try {
      const contentDoc = doc(db, "website-content", id);
      await updateDoc(contentDoc, filteredData);
      getContents({});
      successAlert("Content has been updated successfully.");
    } catch (err: any) {
      errorAlert(err.message || "Internal server error. Please try again later.");
      console.error(err, "=updateContent= request error");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getContents({});
  }, []);

  return (
    <ApiContext.Provider
      value={{
        fetchedData,
        ...fetchedData,
        setFetchedData,
        getContents,
        updateContent,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  return context;
};
