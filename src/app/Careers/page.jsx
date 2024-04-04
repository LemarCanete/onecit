"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { BiTimeFive } from "react-icons/bi";

const Data = [
  {
    id: 1,
    title: "IT/CS",
    subTitle: "Full-Time Faculty",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 2,
    title: "Architecture",
    subTitle: "Full-Time Faculty",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 3,
    title: "Civil Engineering",
    subTitle: "Full-Time Faculty",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 4,
    title: "Computer Engineering",
    subTitle: "Full-Time Faculty",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 5,
    title: "ETEEAP Secretary",
    subTitle: "University",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 6,
    title: "Teller/Finance Analyst",
    subTitle: "University",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 7,
    title: "University Nurse",
    subTitle: "Part-Time",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  {
    id: 8,
    title: "School Librarian",
    subTitle: "High School",
    time: "Now",
    desc: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Amet reprehenderit, nam inventore corrupti eius ex explicabo doloremque repellat vitae soluta distinctio magni quam quo natus sed saepe odit consectetur praesentium.",
  },
  
];

const page = () => {
  return (
    <div className='w-full h-screen flex bg-neutral-100 '>
      <Navbar />
      <div className="grow px-10 py-5">
        <div>
          <h1 className=" font-bold text-2xl ">Open Job Position</h1>
        </div>
        <div className="jobContainer gap-10 justify-items-center items-center py-10 grid grid-cols-4">
          {Data.map(({ id, title, subTitle, time, desc }) => {
            return (
              <div key={id} className="group group/item singleJob w-[350px] p-[20px] bg-white rounded hover:bg-goldColor shadow-lg shadow-greyIsh400/700 hover:shadow-lg">
                <span className="flex justify-between items-center gap-4">
                  <h1 className="text-[16px] font-semibold text-textColor group-hover:text-[#800000]">{title}</h1>
                  <span className="flex items-center text-[#ccc] gap-1">
                    <BiTimeFive />
                    {time}
                  </span>
                </span>
                <h6 className="text-[#800000]">{subTitle}</h6>
                <p className="text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-[#800000]">{desc}</p>
                <button className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-[#800000] group-hover/item:text-textColor group-hover:text-white mt-5">
                  Apply Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
