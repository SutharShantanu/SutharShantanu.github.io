"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as faceapi from "face-api.js";
import MobileCarousel from "@/Components/MobileCarousel";

const Homepage = () => {
    const [instagramMedia, setInstagramMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchInstagramMedia = async () => {
            try {
                const MODEL_URL = "/models";
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                ]);

                const response = await fetch("/api/instagram");
                if (!response.ok) {
                    throw new Error("Failed to fetch Instagram media");
                }

                const data = await response.json();

                const items = Array.isArray(data.data.items)
                    && data.data.items.flatMap((item, index) => {
                        if (item.carousel_media) {
                            return item.carousel_media.flatMap((media, mediaIndex) =>
                                media?.image_versions2?.candidates?.map((candidate, candidateIndex) => ({
                                    id: `${index + 1}-${mediaIndex + 1}-${candidateIndex + 1}`,
                                    url: candidate.url,
                                }))
                            );
                        }
                        if (item.image_versions2) {
                            return item.image_versions2.candidates.map((candidate, candidateIndex) => ({
                                id: `${index + 1}-0-${candidateIndex + 1}`,
                                url: candidate.url,
                            }));
                        }
                        return [];
                    });

                console.log("Processed Items:", items);

                const processedImages = await processInstagramMedia(items);
                setInstagramMedia(processedImages);
            } catch (error) {
                console.error("Error fetching Instagram data:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInstagramMedia();
    }, []);

    /**
     * Function to process Instagram items and extract valid images.
     */
    const processInstagramMedia = async (items) => {
        const filteredImages = [];

        if (!items || items.length === 0) {
            console.warn("No Instagram items found.");
            return [];
        }

        for (const item of items) {
            if (item.carousel_media) {
                for (const media of item.carousel_media) {
                    try {
                        const imageUrl = media.image_versions2.candidates[0].url;
                        const img = await faceapi.fetchImage(imageUrl);
                        const detections = await faceapi
                            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                            .withFaceLandmarks()
                            .withFaceDescriptors();

                        if (detections.length === 1) {
                            filteredImages.push({ id: media.id, image: imageUrl });
                        }
                    } catch (error) {
                        console.warn("Error processing image:", error);
                    }
                }
            }
        }
        console.log("Filtered Images:", filteredImages);
        return filteredImages;
    };

    return (
        <section
            id="homepage"
            className="border border-neutral-200 dark:border-neutral-800 min-h-[80vh] sm:min-h-[87vh] dark:bg-neutral-900 bg-neutral-100 w-[90%] xl:max-w-[80%] m-auto mt-24 sm:p-8 rounded-lg shadow-xs"
        >
            {/* Scroll Animation Section */}
            <div className="min-h-[80vh] grid grid-cols-1 2xl:grid-cols-2 justify-around items-center p-6 lg:p-0">
                {/* Header Text Animation */}
                <div className="w-full md:w-fit inline-block m-auto">
                    <motion.h1
                        className="text-5xl sm:text-[6rem] lg:text-[8rem] text-center sm:text-left inline-block bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 leading-normal p-2 rounded-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Hey, I&apos;m
                    </motion.h1>
                    <motion.h1
                        className="text-5xl sm:text-[6rem] lg:text-[8rem] w-min text-center sm:text-left bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 leading-relaxed p-2 rounded-md"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        Shantanu!
                    </motion.h1>
                </div>

                {/* Carousel Animation */}
                <div className="m-auto w-full md:max-w-[70%] lg:max-w-[60%] 2xl:max-w-[75%]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        {loading ? (
                            <p className="text-center text-neutral-700 dark:text-neutral-300">
                                Loading Instagram Media...
                            </p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : (
                            <MobileCarousel slides={instagramMedia} options={{ loop: true }} />
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Homepage;
