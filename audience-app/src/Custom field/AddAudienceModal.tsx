import { useEffect, useState } from "react";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

import ContentstackAppSDK from "@contentstack/app-sdk";

import {
  Button,
  ButtonGroup,
  Field,
  Icon,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@contentstack/venus-components";

import {
  ExpandCloseIcon,
  CheckedIcon,
  SemiCheckedIcon,
  UncheckedIcon,
  ExpandOpenIcon,
} from "../common/icons";

import "./modal.css";

export const AddAudienceModal = (props: any) => {
  let { audiences, selectedAudiences, setSelectedAudiences } = props;

  const [checked, setChecked] = useState(selectedAudiences);
  const [expanded, setExpanded] = useState<any>([]);
  const [appSdk, setAppSdk] = useState<any>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = await ContentstackAppSDK.init();
        setAppSdk(sdk);
      } catch (error) {
        console.error(error);
      }
    };
    initializeSDK();
  }, []);

  const handleAddAudiences = async () => {
    setSelectedAudiences(checked);
    props.closeModal();
  };

  return (
    <div>
      <ModalHeader title="Select Audience" closeModal={props.closeModal} />
      <ModalBody>
        <div
          style={{
            height: "234px",
          }}
        >
          <Field>
            <CheckboxTree
              // iconsClass="fa5"
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
              nativeCheckboxes={false}
              //   checkModel="all"
              icons={{
                check: <CheckedIcon />,
                uncheck: <UncheckedIcon />,
                halfCheck: <SemiCheckedIcon />,
                expandOpen: <ExpandOpenIcon />,
                expandClose: <ExpandCloseIcon />,
              }}
            />
          </Field>
        </div>
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
