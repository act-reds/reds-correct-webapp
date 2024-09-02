import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CorrectionData } from "../../../../types/CorrectionTypes";
import MultipleSelectChoice from "@/components/MultipleSelectChoice";
import { useParams } from "next/navigation";
import { generateMailBody } from "@/app/code/utils/corrections/generateMailBody";

interface SendFeedbackToStudentsProps {
  correctionData: CorrectionData[];
  labData: any;
}

interface FormValues {
  sender: string;
  ccRecipients: string[];
  emailSubject: string;
  emailHeader: string;
  emailFooter: string;
}

const SendFeedbackToStudents: React.FC<SendFeedbackToStudentsProps> = ({
  correctionData,
  labData,
}) => {
  const params = useParams();

  // Create the default subject using params from the URL
  const defaultSubject = `[${params.courseName} - ${params.year}] Rendu ${params.labName}`;
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      sender: "",
      ccRecipients: [],
      emailSubject: defaultSubject, // Set default subject
      emailHeader: `Bonjour,\nVous trouverez dans ce mail (ci-dessous) le détail de la note et les remarques sur votre travail.\n\n`, // Set default header
      emailFooter: `Ce mail est généré automatiquement et ne nécessite pas de réponse de votre part ;)\nBonne journée.\n`, // Set default footer
    },
  });

  const [assistants, setAssistants] = useState<any[]>([]);
  const [emailBody, setEmailBody] = useState<string>("");

  const fetchAssistants = async (labId: number) => {
    try {
      const response = await fetch(
        `/api/data/lab/${labData.id}/get-assistants`
      );
      const data = await response.json();
      return data.assistants;
    } catch (error) {
      console.error("Error fetching assistants:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadAssistants = async () => {
      const assistantsData = await fetchAssistants(labData.id);
      setAssistants(assistantsData);
    };

    loadAssistants();
  }, [labData.id]);

  // UseEffect to update emailBody when correctionData changes
  useEffect(() => {
    if (correctionData.length > 0) {
      const generatedBody = `${generateMailBody(correctionData[0], true)}\n\n`;
      setEmailBody(generatedBody); // Set emailBody to the generated value
    }
  }, [correctionData]);

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    // You can also handle form submission here, such as sending the data to an API
  };
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="sender">
            <Form.Label column sm={2}>
              Sender
            </Form.Label>

            <Col sm={10}>
              <Controller
                name="sender"
                control={control}
                rules={{ required: "Sender is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="select"
                    {...field}
                    isInvalid={!!errors.sender}
                  >
                    <option value="">Select a sender</option>
                    {assistants.map((assistant) => (
                      <option key={assistant.id} value={assistant.mail}>
                        {assistant.mail}
                      </option>
                    ))}
                  </Form.Control>
                )}
              />
              {errors.sender && (
                <Form.Control.Feedback type="invalid">
                  {errors.sender.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="ccRecipient">
            <Form.Label column sm={2}>
              CC recipient
            </Form.Label>
            <Col sm={10}>
              <MultipleSelectChoice
                label="CC Recipients"
                assistants={assistants}
                control={control}
                setValue={setValue}
                getValues={getValues}
                formName="ccRecipients"
                formValues={getValues("ccRecipients")}
              />
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="emailSubject">
            <Form.Label column sm={2}>
              Email Subject
            </Form.Label>
            <Col sm={10}>
              <Controller
                name="emailSubject"
                control={control}
                rules={{ required: "Email Subject is required" }}
                render={({ field }) => (
                  <Form.Control
                    type="text"
                    {...field}
                    isInvalid={!!errors.emailSubject}
                  />
                )}
              />
              {errors.emailSubject && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailSubject.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="emailHeader">
            <Form.Label column sm={2}>
              Email header
            </Form.Label>
            <Col sm={10}>
              <Controller
                name="emailHeader"
                control={control}
                rules={{ required: "Email Body is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    isInvalid={!!errors.emailHeader}
                  />
                )}
              />
              {errors.emailHeader && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailHeader.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="emailBody">
            <Form.Label column sm={2}>
              Email Body
            </Form.Label>
            <Col sm={10}>
              {/* Display the email body as plain text with a light gray background */}
              <div
                className="p-3 rounded"
                style={{
                  backgroundColor: "#b5b7c4", // Light gray background (Bootstrap light color)
                  whiteSpace: "pre-wrap",
                  border: "1px solid #b5b7c4",
                }}
              >
                {emailBody}
              </div>
            </Col>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Row} controlId="emailFooter">
            <Form.Label column sm={2}>
              Email footer
            </Form.Label>
            <Col sm={10}>
              <Controller
                name="emailFooter"
                control={control}
                rules={{ required: "Email Body is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    isInvalid={!!errors.emailFooter}
                  />
                )}
              />
              {errors.emailFooter && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailFooter.message}
                </Form.Control.Feedback>
              )}
            </Col>
          </Form.Group>
        </Row>
        <Button variant="primary" type="submit">
          Send Email
        </Button>
      </Form>
    </div>
  );
};

export default SendFeedbackToStudents;
