import { DiaryDTO } from "task-craft-models";
import Container from "../../../core/components/Container";
import { Temporal } from "@js-temporal/polyfill";
import { getDatePhraseFromTemporal } from "../../../core/hooks/dateConversions";
import { useNavigate } from "react-router-dom";

type DiaryCardProps = {
  diary: DiaryDTO;
};

export default function DiaryCard({ diary }: DiaryCardProps) {
  const temporalDate = Temporal.PlainDateTime.from(diary.activityDate);
  const stringDate = getDatePhraseFromTemporal({ date: temporalDate });
  const navigate = useNavigate();

  const truncateDescription = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  const onClick = () =>
    navigate(`/diaries/detailsDiary/${diary.idDiary}?redirectTo=/dashboard/diaries`);

  return (
    <Container onClick={onClick} className="flex flex-col gap-2.5 cursor-pointer min-h-28">
      <h2 className="text-primary hover:underline">{diary.title}</h2>
      <h3 className="text-greyDark">{stringDate}</h3>
      <p className="line-clamp-3 overflow-hidden text-ellipsis">
        {truncateDescription(diary.description)}
      </p>
    </Container>
  );
}
