"use client";
import React from "react";
import NavbarIconsOnly from "@/components/NavbarIconsOnly";
// import { db } from "@/firebase-config";
// import { addDoc, collection } from 'firebase/firestore';
// import React, { useState } from 'react';

const page = () => {
  return (
    <div className="w-full h-screen flex bg-neutral-100">
      <NavbarIconsOnly />
      <form>
        <div className="space-y-5 grow px-10 py-5">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-3xl font-semibold leading-7 text-gray-900">
              Request Form
            </h2>
            <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="idNumber"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  ID number
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="idNumber"
                    id="idNumber"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-full">
                <label
                  htmlFor="emailAddress"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="emailAddress"
                    id="emailAddress"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="program"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Program &#x28;Example: BS Industrial Engineering&#x29;
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="program"
                    id="program"
                    autoComplete="program"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="year-level"
                  className="block text-lg font-medium leading-6 text-gray-900"
                >
                  Year Level
                </label>
                <div className="mt-2">
                  <select
                    id="year-level"
                    name="year-level"
                    autoComplete="year-level-name"
                    className=" block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6 w-max"
                  >
                    <option>First Year</option>
                    <option>Second Year</option>
                    <option>Third Year</option>
                    <option>Fourth Year</option>
                    <option>Fifth Year</option>
                    <option>Graduate Students</option>
                    <option>ETEEAP Students</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="space-y-5 grow px-10 py-5">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-xl font-semibold leading-7 text-gray-900 mt-12 space-y-12">
            Which of the following documents are you requesting for a copy?
          </h2>
          <div className="mt-5 space-y-6">
            <fieldset>
              <div className="mt-1 space-y-3">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="text-lg font-medium text-gray-900"
                    >
                      Certification of Enrollment
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="candidates"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="candidates"
                      className="text-lg font-medium text-gray-900"
                    >
                      Certificate of Graduation
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="text-lg font-medium text-gray-900"
                    >
                      Transcript of Records
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="certificates"
                      className="text-lg font-medium text-gray-900"
                    >
                      Diploma
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="comments"
                      className="text-lg font-medium text-gray-900"
                    >
                      Certificate of Transfer Credentials/Honorablle Dismissal
                    </label>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="comments"
                      name="certificates"
                      type="radio"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label
                      htmlFor="others"
                      className="text-lg font-medium text-gray-900"
                    >
                      Other:{" "}
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="certificates"
                        id="others"
                        autoComplete="given-name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-base font-semibold leading-7 text-gray-900 mt-12 space-y-12">
                Number of Copies
              </legend>
              <div className="sm:col-span-2 sm:col-start-1">
                <div className="mt-3">
                  <select
                    id="numberOfCopies"
                    name="numberOfCopies"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-lg sm:leading-6"
                  >
                    <option>One</option>
                    <option>Two</option>
                    <option>Three</option>
                  </select>
                </div>
              </div>
              <legend className="text-base font-semibold leading-7 text-gray-900 mt-12 space-y-12">
                What is the purpose of the request?
              </legend>
              <div className="mt-1">
                <input
                  type="text"
                  name="program"
                  id="program"
                  autoComplete="program"
                  className="block w-6/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
