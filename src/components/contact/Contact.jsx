import "./contact.css";
import emailjs from "@emailjs/browser";
import {
    Box,
    Heading,
    Text,
    IconButton,
    Button,
    VStack,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
    useToast,
} from "@chakra-ui/react";
import {
    AiOutlineInstagram,
    AiOutlineCodepen,
    AiFillLinkedin,
} from "react-icons/ai";
import { FiSend } from "react-icons/fi";

import {
    MdPhone,
    MdEmail,
    MdLocationOn,
    MdFacebook,
    MdOutlineEmail,
} from "react-icons/md";
import { BsGithub, BsPerson } from "react-icons/bs";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
import { useRef, useState } from "react";
// ..
AOS.init();

function Contact() {
    const openLink = (url) => {
        window.open(url);
    };
    const toast = useToast();
    const form = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const sendEmail = (e) => {
        e.preventDefault();
        if (name === "" || email === "" || message === "") {
            toast({
                title: "Please fill all details !",
                description: "",
                status: "warning",
                variant: "left-accent",
                duration: 2500,
                isClosable: true,
                position: "top",
            });
        } else {
            emailjs
                .sendForm(
                    "service_nkw8tig", //YOUR_SERVICE_ID
                    "template_can7fvb", //YOUR_TEMPLATE_ID
                    e.target,
                    "73_-qTWrUzxfELamL" //YOUR_PUBLIC_KEY
                )
                .then(
                    (result) => {
                        toast({
                            title: "Message sent",
                            description:
                                "Your message have been sent successfully",
                            status: "success",
                            duration: 2500,
                            isClosable: true,
                            position: "top",
                        });
                        console.log(result.text);
                    },
                    (error) => {
                        toast({
                            title: "Error occurred",
                            description: "Something went wrong",
                            status: "error",
                            duration: 2500,
                            isClosable: true,
                            position: "top",
                        });
                        console.log(error.text);
                    }
                );
        }
    };
    return (
        <div className="contact-main" id="contact">
            <div className="text-divider-contact"></div>
            <div className="headingwrapper">
                <h1 className="contactheading">Contact</h1>

                <Box
                    bg="#1a1a1a"
                    color="white"
                    id="contact_all"
                    border={"1px solid rgba(255, 255, 255, 0.125)"}
                    borderRadius="15px"
                    m={{ sm: 2, md: 12, lg: 8 }}
                    p={{ sm: 5, md: 5, lg: 16 }}>
                    <Box
                        // display={"flex"}
                        // justifyContent={"space-between"}
                        // flexDirection={"row"}
                        className="contact_main"
                        // spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}
                    >
                        <Box
                            data-aos="fade-right"
                            data-aos-duration="3000"
                            data-aos-mirror="true"
                            id="contact_details">
                            <Box>
                                <Heading>Details</Heading>
                                <Text
                                    mt={{ sm: 3, md: 3, lg: 5 }}
                                    color="gray.500">
                                    Fill up the form below to contact
                                </Text>
                                <Box
                                    py={{
                                        base: 5,
                                        sm: 5,
                                        md: 8,
                                        lg: 10,
                                    }}>
                                    <VStack
                                        pl={0}
                                        // spacing={3}
                                        // alignItems="flex-start"
                                        textAlign="left">
                                        <Button
                                            // display={"block"}
                                            border={"2px solid transparent"}
                                            size="md"
                                            height="48px"
                                            width="80%"
                                            variant="ghost"
                                            color="#DCE2FF"
                                            textAlign="left"
                                            id="contact-phone"
                                            _hover={{
                                                border: "2px solid rgba(255, 255, 255, 0.125)",
                                            }}
                                            onClick={() =>
                                                openLink("tel:7732962110")
                                            }
                                            leftIcon={
                                                <MdPhone
                                                    color="#8f3e41"
                                                    size="20px"
                                                />
                                            }>
                                            +917732962110
                                        </Button>
                                        <Button
                                            // display={"block"}
                                            border={"2px solid transparent"}
                                            size="md"
                                            height="48px"
                                            width="80%"
                                            variant="ghost"
                                            color="#DCE2FF"
                                            id="contact-email"
                                            textAlign="left"
                                            _hover={{
                                                border: "2px solid rgba(255, 255, 255, 0.125)",
                                            }}
                                            onClick={() =>
                                                openLink(
                                                    "mailto:shantanusut2000@gmail.com"
                                                )
                                            }
                                            leftIcon={
                                                <MdEmail
                                                    color="#8f3e41"
                                                    size="20px"
                                                />
                                            }>
                                            Shantanusut2000@Gmail.com
                                        </Button>
                                        <Button
                                            // display={"block"}
                                            border={"2px solid transparent"}
                                            size="md"
                                            height="48px"
                                            width="80%"
                                            variant="ghost"
                                            color="#DCE2FF"
                                            textAlign="left"
                                            onClick={() =>
                                                openLink(
                                                    "https://goo.gl/maps/iZk5aqYGHrk9kk2Z8"
                                                )
                                            }
                                            _hover={{
                                                border: "2px solid rgba(255, 255, 255, 0.125)",
                                            }}
                                            leftIcon={
                                                <MdLocationOn
                                                    color="#8f3e41"
                                                    size="20px"
                                                />
                                            }>
                                            Hanumangarh, India
                                        </Button>
                                    </VStack>
                                </Box>
                                <Box
                                    mt={{ lg: 10, md: 10 }}
                                    spacing={5}
                                    px={5}
                                    alignItems="flex-start">
                                    <IconButton
                                        aria-label="facebook"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        onClick={() =>
                                            openLink(
                                                "https://www.facebook.com/SutharShantanu"
                                            )
                                        }
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<MdFacebook size="28px" />}
                                    />
                                    <IconButton
                                        aria-label="github"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        id="contact-github"
                                        onClick={() =>
                                            openLink(
                                                "https://github.com/SutharShantanu"
                                            )
                                        }
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<BsGithub size="28px" />}
                                    />
                                    <IconButton
                                        aria-label="codepen"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        onClick={() =>
                                            openLink(
                                                "https://codepen.io/sutharshantanu7"
                                            )
                                        }
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<AiOutlineCodepen size="28px" />}
                                    />
                                    <IconButton
                                        aria-label="linkedin"
                                        id="contact-linkedin"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        onClick={() =>
                                            openLink(
                                                "https://www.linkedin.com/in/shantanu-suthar-8347031ab/"
                                            )
                                        }
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<AiFillLinkedin size="28px" />}
                                    />
                                    <IconButton
                                        aria-label="instagram"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        onClick={() =>
                                            openLink(
                                                "https://www.instagram.com/shantanu.suthar/"
                                            )
                                        }
                                        icon={
                                            <AiOutlineInstagram size="28px" />
                                        }
                                    />
                                </Box>
                            </Box>
                        </Box>

                        <Box
                            data-aos="fade-right"
                            data-aos-duration="3000"
                            data-aos-mirror="true"
                            bg="rgba(255, 255, 255, 0.125)"
                            borderRadius="lg"
                            id="contact_fill"
                            border={"1px solid rgba(255, 255, 255, 0.125)"}>
                            <Box m={8} color="white">
                                <form
                                    // spacing={5}
                                    ref={form}
                                    onSubmit={sendEmail}>
                                    <FormControl id="name">
                                        <FormLabel
                                            style={{
                                                margin: "20px 0px 0px 0px",
                                            }}>
                                            Your Name
                                        </FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={
                                                    <BsPerson color="gray.800" />
                                                }
                                            />
                                            <Input
                                                type="text"
                                                size="md"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                placeholder="Your name"
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="name">
                                        <FormLabel
                                            style={{
                                                margin: "20px 0px 0px 0px",
                                            }}>
                                            Email
                                        </FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={
                                                    <MdOutlineEmail color="gray.800" />
                                                }
                                            />
                                            <Input
                                                type="text"
                                                size="md"
                                                placeholder="Email address"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                            />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="name">
                                        <FormLabel
                                            style={{
                                                margin: "20px 0px 0px 0px",
                                            }}>
                                            Message
                                        </FormLabel>
                                        <Textarea
                                            borderColor="gray.300"
                                            _hover={{
                                                borderRadius: "gray.300",
                                            }}
                                            placeholder="Write your greeting"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                        />
                                    </FormControl>
                                    <FormControl id="name" float="right">
                                        <Button
                                            style={{
                                                margin: "20px 0px 0px 0px",
                                            }}
                                            variant="solid"
                                            border={"2px solid transparent"}
                                            bg="#8f3e41"
                                            transition={"all .2s ease-in-out"}
                                            color="white"
                                            type="submit"
                                            value="Send"
                                            _hover={{
                                                bgColor: "transparent",
                                                border: "2px solid #8f3e41",
                                                boxShadow:
                                                    "rgba(255, 255, 255, 0.125) 0px 3px 8px",
                                            }}>
                                            Send Message <span>&nbsp;</span>
                                            <FiSend />
                                        </Button>
                                    </FormControl>
                                </form>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default Contact;
