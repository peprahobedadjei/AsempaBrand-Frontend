import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import routes from "@/utils/routes";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { BsFillBasket3Fill } from "react-icons/bs";
import { IoHeartOutline } from "react-icons/io5";
import { fetchACollection } from "@/server/collectionapi";

function SingleCollection() {

    const router = useRouter();
    const { slug } = router.query;
    const [categoryData, setCategoryData] = useState(null);
    const [loading, setLoading] = useState(true);
  
  
    useEffect(() => {
      if (slug) {
        const fetchData = async () => {
          try {
            const data = await fetchACollection(slug);
            setCategoryData(data);
            console.log("Category Data:", data);
          } catch (error) {
            console.error("Failed to fetch category data", error);
          } finally {
            setLoading(false);
          }
        };
  
        fetchData();
      }
    }, [slug]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!categoryData) {
      return <div>No category data found</div>;
    }
  return (
    <div className="pb-14">
    <div className="flex justify-center items-center h-32 bg-[#C691044D]">
      <p className="text-black text-4xl font-semibold">{categoryData.name}</p>
    </div>
    <p className="text-black text-sm p-4 ">
      <Link
        href={routes.pages.home}
        className="text-black text-sm hover:underline"
      >
        Fashion
      </Link>
      /
      <Link href={"/collcetion"} className="text-sm hover:underline">
        Collection
      </Link>
      /<span className="font-semibold text-sm">{categoryData.name}</span>
    </p>


    {/* Conditionally render category items section */}
    {categoryData.products.length > 0 && (
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Collection Items</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
          {categoryData.products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-64 rounded-lg bg-gray-100 p-4 relative"
            >
              <div className="absolute top-2 left-2 flex items-center justify-between w-full">
                {product.tags !== "" && (
                  <div className="bg-brandTertiary text-white px-2 py-1 text-xs font-light rounded-full cursor-pointer">
                    {product.tags}
                  </div>
                )}
                <div className="mr-6 bg-brandSecondary p-2 rounded-full text-white cursor-pointer">
                  <IoHeartOutline />
                </div>
              </div>
              <Link href={routes.pages.detials(product.slug)}>
              <Image
                src={`${routes.images.base}${product.featured_image}`}
                alt={product.name}
                height={100}
                width={100}
                className="h-36 mx-auto mb-2 rounded cursor-pointer"
              />
              </Link>
              <h3 className="text-base font-bold mb-2">{product.name}</h3>
              <p className="text-gray-500 text-xs mb-4">
                {product.short_description}
              </p>

              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={`h-4 w-4 cursor-pointer ${
                      index < Math.floor(product.average_rating)
                        ? "text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.average_rating.toFixed(1)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold text-base">
                  {product.current_price}
                </span>
                <button className="bg-brandSecondary text-white px-4 py-2 rounded-lg hover:bg-brandSecondary text-sm flex items-center space-x-2 cursor-pointer">
                  <BsFillBasket3Fill className="w-4 h-4" />
                  <span>Add to Basket</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
  )
}

export default SingleCollection