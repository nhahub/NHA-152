import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { MapPin, Edit, Trash2 } from "lucide-react";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
  selectedId,
}) {
  const isSelected = selectedId?._id === addressInfo?._id;

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
      className={`cursor-pointer transition-all rounded-2xl border-2 ${
        isSelected
          ? "border-[#3785D8] bg-gradient-to-br from-[#EAF2FB] to-white dark:from-slate-800 dark:to-slate-900 shadow-lg"
          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md"
      }`}
    >
      <CardContent className="p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isSelected 
              ? "bg-gradient-to-r from-[#3785D8] to-[#BF8CE1]" 
              : "bg-slate-100 dark:bg-slate-700"
          }`}>
            <MapPin className={`w-5 h-5 ${isSelected ? "text-white" : "text-slate-600 dark:text-slate-300"}`} />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm text-gray-600 dark:text-slate-400 mb-1">Address</p>
              <p className="font-medium text-gray-900 dark:text-white">{addressInfo?.address}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-600 dark:text-slate-400">City</p>
                <p className="font-medium text-gray-900 dark:text-white">{addressInfo?.city}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-slate-400">Pincode</p>
                <p className="font-medium text-gray-900 dark:text-white">{addressInfo?.pincode}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 dark:text-slate-400">Phone</p>
              <p className="font-medium text-gray-900 dark:text-white">{addressInfo?.phone}</p>
            </div>
            {addressInfo?.notes && (
              <div>
                <p className="text-gray-600 dark:text-slate-400">Notes</p>
                <p className="text-sm text-gray-700 dark:text-slate-300">{addressInfo?.notes}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
          variant="outline"
          className="rounded-lg border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
          variant="outline"
          className="rounded-lg border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
