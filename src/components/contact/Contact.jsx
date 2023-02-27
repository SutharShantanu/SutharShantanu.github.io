import "./contact.css";
import { SiGmail } from "react-icons/si";
import { IoMdCall } from "react-icons/io";

import {
    Container,
    Flex,
    Box,
    Heading,
    Text,
    IconButton,
    Button,
    VStack,
    HStack,
    Wrap,
    WrapItem,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    Textarea,
} from "@chakra-ui/react";
import {
    MdPhone,
    MdEmail,
    MdLocationOn,
    MdFacebook,
    MdOutlineEmail,
} from "react-icons/md";
import { BsGithub, BsDiscord, BsPerson } from "react-icons/bs";

function Contact() {
    const openLink = (url) => {
        window.open(url);
    };
    return (
        <div className="contact-main" id="contact">
            <div className="headingwrapper">
                <div class="text-divider-project"></div>

                <h1 className="contactheading">Contact</h1>
                {/* <div className="headingwrapperDiv">
          <div className="headingwrapperDivLeft">
            <img
              src="https://www.genscript.com/gsimages/support/image-contactus.png"
              alt="contactme"
            />
          </div>
          <div className="headingwrapperDivRight">
            <div className="contact-gmail" id="contact-email">
              <SiGmail /> Shantanusut2000@gmail.com
            </div>
            <div className="contact-number" id="contact-phone">
              <IoMdCall /> +917732962110
            </div>
            <div className="contact-location">
              <MdLocationOn /> Hanumangarh, Rajasthan
            </div>
            <div className="contact-socialLink">
              <img
                onClick={() => openLink("https://github.com/SutharShantanu")}
                src={process.env.PUBLIC_URL + "./Images/github.svg"}
                alt="About"
                id="contact-github"
              />
              <img
                onClick={() =>
                  openLink("https://www.linkedin.com/in/SutharShantanu")
                }
                src={process.env.PUBLIC_URL + "./Images/linkedin.svg"}
                alt="About"
                id="contact-linkedin"
              />
            </div>
          </div>
        </div> */}

                <Box
                    bg="#1a1a1a"
                    color="white"
                    border={"1px solid rgba(255, 255, 255, 0.125)"}
                    borderRadius="15px"
                    m={{ sm: 4, md: 16, lg: 10 }}
                    p={{ sm: 5, md: 5, lg: 16 }}>
                    <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        flexDirection={"row"}
                        // spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}
                    >
                        <Box>
                            <Box>
                                <Heading>Contact</Heading>
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
                                            _hover={{
                                                border: "2px solid rgba(255, 255, 255, 0.125)",
                                            }}
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
                                            textAlign="left"
                                            _hover={{
                                                border: "2px solid rgba(255, 255, 255, 0.125)",
                                            }}
                                            leftIcon={
                                                <MdEmail
                                                    color="#8f3e41"
                                                    size="20px"
                                                />
                                            }>
                                            Shantanusut2000.com
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
                                <HStack
                                    mt={{ lg: 10, md: 10 }}
                                    spacing={5}
                                    px={5}
                                    alignItems="flex-start">
                                    <IconButton
                                        aria-label="facebook"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
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
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<BsGithub size="28px" />}
                                    />
                                    <IconButton
                                        aria-label="discord"
                                        variant="ghost"
                                        size="lg"
                                        isRound={true}
                                        _hover={{
                                            bg: "rgba(255, 255, 255, 0.125)",
                                        }}
                                        icon={<BsDiscord size="28px" />}
                                    />
                                </HStack>
                            </Box>
                        </Box>

                        <Box
                            bg="rgba(255, 255, 255, 0.125)"
                            borderRadius="lg"
                            border={"1px solid rgba(255, 255, 255, 0.125)"}>
                            <Box m={8} color="white">
                                <VStack spacing={5}>
                                    <FormControl id="name">
                                        <FormLabel>Your Name</FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={
                                                    <BsPerson color="gray.800" />
                                                }
                                            />
                                            <Input type="text" size="md" />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="name">
                                        <FormLabel>Mail</FormLabel>
                                        <InputGroup borderColor="#E0E1E7">
                                            <InputLeftElement
                                                pointerEvents="none"
                                                children={
                                                    <MdOutlineEmail color="gray.800" />
                                                }
                                            />
                                            <Input type="text" size="md" />
                                        </InputGroup>
                                    </FormControl>
                                    <FormControl id="name">
                                        <FormLabel>Message</FormLabel>
                                        <Textarea
                                            borderColor="gray.300"
                                            _hover={{
                                                borderRadius: "gray.300",
                                            }}
                                            placeholder="message"
                                        />
                                    </FormControl>
                                    <FormControl id="name" float="right">
                                        <Button
                                            variant="solid"
                                            bg="#0D74FF"
                                            color="white"
                                            _hover={{}}>
                                            Send Message
                                        </Button>
                                    </FormControl>
                                </VStack>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </div>
        </div>
    );
}

export default Contact;
