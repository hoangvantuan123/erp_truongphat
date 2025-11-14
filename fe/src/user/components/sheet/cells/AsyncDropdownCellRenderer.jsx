import CustomRenderer, {
  getMiddleCenterBias,
  GridCellKind,
  TextCellEntry,
  useTheme
} from "@glideapps/glide-data-grid";

import Select, { components } from "react-select";

const Wrap = (props) => {
  return <div>{props.children}</div>;
};

const ReadOnlyWrap = (props) => {
  return <div>{props.children}</div>;
};

const PortalWrap = (props) => {
  return <div>{props.children}</div>;
};

const CustomMenu = (p) => {
  const { Menu } = components;
  const { children, ...rest } = p;
  return <Menu {...rest}>{children}</Menu>;
};

const Editor = (p) => {
  const { value: cell, onFinishedEditing, initialValue } = p;
  const { allowedValues = [], value: valueIn } = cell.data;

  const [inputValue, setInputValue] = React.useState(initialValue ?? "");

  const theme = useTheme();

  const values = React.useMemo(
    () =>
      allowedValues.map((x) => ({
        value: x,
        label: x
      })),
    [allowedValues]
  );

  if (cell.readonly) {
    return (
      <ReadOnlyWrap>
        <TextCellEntry
          highlight={true}
          autoFocus={false}
          disabled={true}
          value={valueIn ?? ""}
          onChange={() => undefined}
        />
      </ReadOnlyWrap>
    );
  }

  return (
    <Wrap>
      <Select
        className="glide-select"
        inputValue={inputValue}
        onInputChange={setInputValue}
        menuPlacement={"auto"}
        value={values.find((x) => x.value === valueIn)}
        styles={{
          control: (base) => ({
            ...base,
            border: 0,
            boxShadow: "none"
          }),
          option: (base) => ({
            ...base,
            fontSize: theme.editorFontSize,
            fontFamily: theme.fontFamily,
            ":empty::after": {
              content: '"&nbsp;"',
              visibility: "hidden"
            }
          })
        }}
        theme={(t) => {
          return {
            ...t,
            colors: {
              ...t.colors,
              neutral0: theme.bgCell,
              neutral5: theme.bgCell,
              neutral10: theme.bgCell,
              neutral20: theme.bgCellMedium,
              neutral30: theme.bgCellMedium,
              neutral40: theme.bgCellMedium,
              neutral50: theme.textLight,
              neutral60: theme.textMedium,
              neutral70: theme.textMedium,
              neutral80: theme.textDark,
              neutral90: theme.textDark,
              neutral100: theme.textDark,
              primary: theme.accentColor,
              primary75: theme.accentColor,
              primary50: theme.accentColor,
              primary25: theme.accentLight
            }
          };
        }}
        menuPortalTarget={document.getElementById("portal")}
        autoFocus={true}
        openMenuOnFocus={true}
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Menu: (props) => (
            <PortalWrap>
              <CustomMenu className={"click-outside-ignore"} {...props} />
            </PortalWrap>
          )
        }}
        options={values.filter((x) =>
          x.label.toLowerCase().includes(inputValue.toLowerCase())
        )}
        onChange={async (e) => {
          if (e === null) return;
          await new Promise((r) => window.requestAnimationFrame(r));
          onFinishedEditing({
            ...cell,
            data: {
              ...cell.data,
              value: e.value
            }
          });
        }}
        placeholder=""
      />
    </Wrap>
  );
};

export const AsyncDropdownCellRenderer = {
  kind: GridCellKind.Custom,
  isMatch: (c) => c.data.kind === "async-dropdown-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value } = cell.data;
    if (value) {
      ctx.fillStyle = theme.textDark;
      ctx.fillText(
        value,
        rect.x + theme.cellHorizontalPadding,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme)
      );
    }
    return true;
  },
  measure: (ctx, cell) => {
    const { value } = cell.data;
    if (value) {
      return ctx.measureText(value).width + 16;
    } else {
      return 16;
    }
  },
  provideEditor: () => ({
    editor: Editor,
    disablePadding: true,
    deletedValue: (v) => ({
      ...v,
      copyData: "",
      data: {
        ...v.data,
        value: ""
      }
    })
  }),
  onPaste: (v, d) => ({
    ...d,
    value: d.allowedValues.includes(v) ? v : ""
  })
};