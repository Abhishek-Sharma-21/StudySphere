// Email functionality stubbed for static feature
export const sendEmail = async (options) => {
  try {
    console.log("--- STUBBED EMAIL ---");
    console.log("To:", options.email);
    console.log("Subject:", options.subject);
    console.log("Message:", options.message);
    console.log("----------------------");
    return true;
  } catch (error) {
    console.error("Error in stubbed sendEmail:", error);
    return false;
  }
};
