import { useState } from "react";
import CheckboxTree from "react-checkbox-tree";

import {
  Button,
  ButtonGroup,
  Field,
  Icon,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";

export const AddAudienceModal = (props: any) => {
  let { audiences, selectedAudiences, setSelectedAudiences } = props;

  const [checked, setChecked] = useState([selectedAudiences]);
  const [expanded, setExpanded] = useState<any>([]);

  const handleAddAudiences = () => {
    setSelectedAudiences(checked);
    props.closeModal();
  };

  return (
    <div>
      <ModalHeader title="Select Audience" closeModal={props.closeModal} />
      <ModalBody>
        <Field>
          <CheckboxTree
            iconsClass="fa5"
            showNodeIcon={false}
            nodes={audiences}
            checked={checked}
            expanded={expanded}
            onCheck={(checked) => {
              setChecked(checked);
            }}
            onExpand={(expanded) => {
              setExpanded(expanded);
            }}
            nativeCheckboxes={true}
            // checkModel="all"
            icons={{
              check: <Icon icon="Check" />,
            }}
          />
        </Field>
      </ModalBody>
      <ModalFooter>
        <ButtonGroup>
          <Button buttonType="light" onClick={props.closeModal}>
            Cancel
          </Button>
          <Button
            key="addButton"
            id="addRegionBtn"
            icon="CheckedWhite"
            onClick={handleAddAudiences}
          >
            <span>Add Selected</span>
          </Button>
        </ButtonGroup>
      </ModalFooter>
    </div>
  );
};
