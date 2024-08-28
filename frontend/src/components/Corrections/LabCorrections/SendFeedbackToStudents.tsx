import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Form, Button, Row, Col } from "react-bootstrap";
import { CorrectionData } from "../../../../types/CorrectionTypes";
import MultipleSelectChoice from "@/components/MultipleSelectChoice";

interface SendFeedbackToStudentsProps {
  correctionData: CorrectionData;
  labData: any;
}

interface FormValues {
  sender: string;
  ccRecipients: string[];
  emailSubject: string;
  emailBody: string;
}

const SendFeedbackToStudents: React.FC<SendFeedbackToStudentsProps> = ({
  correctionData,
  labData,
}) => {
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
      emailSubject: "",
      emailBody: "",
    },
  });

  const [assistants, setAssistants] = useState<any[]>([]);

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

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
    // You can also handle form submission here, such as sending the data to an API
  };
  console.log("correeeeeee", correctionData);
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
                name="emailBody"
                control={control}
                rules={{ required: "Email Body is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    isInvalid={!!errors.emailBody}
                  />
                )}
              />
              {errors.emailBody && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailBody.message}
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
              <Controller
                name="emailBody"
                control={control}
                rules={{ required: "Email Body is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={5}
                    {...field}
                    isInvalid={!!errors.emailBody}
                  />
                )}
              />
              {errors.emailBody && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailBody.message}
                </Form.Control.Feedback>
              )}
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
                name="emailBody"
                control={control}
                rules={{ required: "Email Body is required" }}
                render={({ field }) => (
                  <Form.Control
                    as="textarea"
                    rows={2}
                    {...field}
                    isInvalid={!!errors.emailBody}
                  />
                )}
              />
              {errors.emailBody && (
                <Form.Control.Feedback type="invalid">
                  {errors.emailBody.message}
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
